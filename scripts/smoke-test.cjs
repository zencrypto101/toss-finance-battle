const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-smoke-test-'));
  const port = 4173;
  const cdpPort = 9224;

  console.log('[1/4] Starting Vite preview server...');
  const viteBin = path.resolve(__dirname, '../node_modules/vite/bin/vite.js');
  const preview = spawn(process.execPath, [viteBin, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
  });

  function cleanup() {
    try { preview.kill('SIGKILL'); } catch (e) {}
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
  }
  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Wait for server to respond
  let serverReady = false;
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error('Status ' + res.statusCode));
        });
        req.on('error', reject);
      });
      serverReady = true;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!serverReady) {
    console.error('Failed to start Vite preview server');
    cleanup();
    process.exit(1);
  }
  console.log(`[2/4] Vite preview server ready at http://127.0.0.1:${port}`);

  function getChromeExecutable() {
    if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
    if (os.platform() === 'darwin') {
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
    return 'google-chrome';
  }
  const chromeExe = getChromeExecutable();

  console.log('[3/4] Launching Headless Chrome with DevTools Protocol...');
  const chrome = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=420,800',
    '--remote-debugging-port=' + cdpPort,
    '--user-data-dir=' + tmpDir,
    'about:blank'
  ], { stdio: 'ignore' });

  function fullCleanup() {
    try { chrome.kill('SIGKILL'); } catch (e) {}
    cleanup();
  }

  // Wait for CDP endpoint
  let pageWsUrl = null;
  for (let i = 0; i < 40; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${cdpPort}/json`, (res) => {
          let body = '';
          res.on('data', (c) => body += c);
          res.on('end', () => resolve(JSON.parse(body)));
        }).on('error', reject);
      });
      if (Array.isArray(data)) {
        const pageTarget = data.find((t) => t.type === 'page') || data[0];
        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
          pageWsUrl = pageTarget.webSocketDebuggerUrl;
          break;
        }
      }
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!pageWsUrl) {
    console.error('Failed to connect to Chrome DevTools endpoint');
    fullCleanup();
    process.exit(1);
  }

  console.log('[4/4] Inspecting runtime console, DOM, and interactions via CDP...');
  const WebSocket = globalThis.WebSocket;
  const ws = new WebSocket(pageWsUrl);
  const consoleErrors = [];
  const consoleLogs = [];
  let reqId = 1;

  const pendingCommands = new Map();

  await new Promise((res) => ws.addEventListener('open', res));

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);

    if (msg.id && pendingCommands.has(msg.id)) {
      const { resolve, timer } = pendingCommands.get(msg.id);
      clearTimeout(timer);
      pendingCommands.delete(msg.id);
      if (msg.error) {
        console.warn(`[CDP Error ${msg.id}]:`, msg.error);
        resolve(null);
      } else {
        resolve(msg.result);
      }
      return;
    }

    if (msg.method === 'Runtime.consoleAPICalled') {
      const type = msg.params.type;
      const text = msg.params.args.map((a) => a.value || a.description || '').join(' ');
      consoleLogs.push(`[${type}] ${text}`);
      if (type === 'error') {
        consoleErrors.push(text);
      }
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const text = msg.params.exceptionDetails?.text || 'Uncaught exception';
      const desc = msg.params.exceptionDetails?.exception?.description || '';
      consoleErrors.push(`${text}: ${desc}`);
    }
  });

  function sendCommand(method, params = {}) {
    return new Promise((resolve) => {
      const id = reqId++;
      const timer = setTimeout(() => {
        pendingCommands.delete(id);
        console.warn(`[CDP TIMEOUT] ${method} (${id})`);
        resolve(null);
      }, 8000);
      pendingCommands.set(id, { resolve, timer });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCommand('Runtime.enable');
  await sendCommand('Page.enable');
  await sendCommand('Browser.grantPermissions', {
    permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite']
  });

  // --- Step 4.1: Verify Lobby View & Reset Data Flow ---
  console.log('Testing LOBBY view and reset confirmation modal...');
  await sendCommand('Page.navigate', { url: `http://127.0.0.1:${port}/` });
  await new Promise((r) => setTimeout(r, 1200));

  const lobbyEval = await sendCommand('Runtime.evaluate', {
    expression: 'document.getElementById("root")?.innerText || ""',
    returnByValue: true,
  });
  const lobbyText = lobbyEval?.result?.value || '';

  // Check reset button existence
  const resetBtnCheck = await sendCommand('Runtime.evaluate', {
    expression: '!!document.querySelector(\'button[data-testid="reset-data-btn"]\')',
    returnByValue: true,
  });
  const hasResetBtn = resetBtnCheck?.result?.value === true;

  // Click Reset Data button to open modal
  console.log('Clicking "데이터 초기화" button...');
  await sendCommand('Runtime.evaluate', {
    expression: 'document.querySelector(\'button[data-testid="reset-data-btn"]\')?.click()'
  });
  await new Promise((r) => setTimeout(r, 300));

  // Verify modal is visible
  const modalEval = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const modal = document.querySelector('[data-testid="reset-confirm-modal"]');
        return {
          isOpen: !!modal,
          text: modal ? modal.innerText : ''
        };
      })()
    `,
    returnByValue: true,
  });
  const modalInfo = modalEval?.result?.value || { isOpen: false, text: '' };

  // Confirm reset
  console.log('Confirming data reset...');
  await sendCommand('Runtime.evaluate', {
    expression: 'document.querySelector(\'button[data-testid="confirm-reset-btn"]\')?.click()'
  });
  await new Promise((r) => setTimeout(r, 400));

  // Verify modal closed & toast appeared
  const postResetEval = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const modal = document.querySelector('[data-testid="reset-confirm-modal"]');
        const bodyText = document.body.innerText;
        return {
          isModalClosed: !modal,
          hasResetToast: bodyText.includes('초기화되었습니다'),
          hasDefaultLevel: bodyText.includes('Lv.1 훈련병')
        };
      })()
    `,
    returnByValue: true,
  });
  const postResetInfo = postResetEval?.result?.value || { isModalClosed: false, hasResetToast: false, hasDefaultLevel: false };

  // --- Step 4.2: Verify CHART_RESULT View & Clipboard Copy Interaction ---
  console.log('Testing CHART_RESULT view with clipboard copy button & toast...');
  await sendCommand('Runtime.evaluate', {
    expression: 'window.__SET_VIEW__("CHART_RESULT")'
  });
  await new Promise((r) => setTimeout(r, 400));

  const chartResultEval = await sendCommand('Runtime.evaluate', {
    expression: 'document.getElementById("root")?.innerText || ""',
    returnByValue: true,
  });
  const chartResultText = chartResultEval?.result?.value || '';

  // Click the clipboard copy button
  console.log('Clicking "결과 링크 클립보드 복사" button...');
  const clickResult = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[data-testid="copy-chart-result-btn"]') ||
                    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('클립보드 복사'));
        if (!btn) return { found: false };
        btn.click();
        return { found: true };
      })()
    `,
    returnByValue: true,
  });

  // Wait 300ms for toast to display
  await new Promise((r) => setTimeout(r, 300));

  const toastEval = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const toastEl = document.querySelector('[data-testid="toast-message"]');
        const bodyText = document.body.innerText;
        return {
          hasToastEl: !!toastEl,
          toastText: toastEl ? toastEl.innerText : '',
          hasToast: bodyText.includes('클립보드에 복사되었습니다') || bodyText.includes('복사 완료') || bodyText.includes('링크 복사')
        };
      })()
    `,
    returnByValue: true,
  });
  const toastInfo = toastEval?.result?.value || { hasToast: false };

  // --- Step 4.3: Verify COURSE_DART View & 10s Timer Gauge ---
  console.log('Testing COURSE_DART view with 10s timer gauge...');
  await sendCommand('Runtime.evaluate', {
    expression: 'window.__SET_VIEW__("COURSE_DART")'
  });
  await new Promise((r) => setTimeout(r, 400));

  const dartEval = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const gauge = document.querySelector('[data-testid="dart-timer-gauge"]');
        const countdown = document.querySelector('[data-testid="dart-timer-countdown"]');
        return {
          hasGauge: !!gauge,
          hasCountdown: !!countdown,
          countdownText: countdown ? countdown.innerText : ''
        };
      })()
    `,
    returnByValue: true,
  });
  const dartInfo = dartEval?.result?.value || { hasGauge: false, hasCountdown: false };

  // --- Step 4.4: Verify ROADMAP View & Fee Discount Tooltip Component ---
  console.log('Testing ROADMAP view with fee discount tooltip...');
  await sendCommand('Runtime.evaluate', {
    expression: 'window.__SET_VIEW__("ROADMAP")'
  });
  await new Promise((r) => setTimeout(r, 400));

  const roadmapClick = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[data-testid="fee-perk-btn-1"]') || document.querySelector('button[data-testid="hero-fee-perk-btn"]');
        if (!btn) return { found: false };
        btn.click();
        return { found: true };
      })()
    `,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 300));

  const tooltipEval = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const tooltip = document.querySelector('[data-testid="fee-discount-tooltip-1"]');
        const heroBtn = document.querySelector('[data-testid="hero-fee-perk-btn"]');
        return {
          hasTooltip: !!tooltip,
          tooltipText: tooltip ? tooltip.innerText : '',
          hasHeroFeePerk: !!heroBtn
        };
      })()
    `,
    returnByValue: true,
  });
  const tooltipInfo = tooltipEval?.result?.value || { hasTooltip: false };

  // --- Step 4.5: Verify COURSE_FINANCE View & 10-bagger buttons ---
  console.log('Testing COURSE_FINANCE view...');
  await sendCommand('Runtime.evaluate', {
    expression: 'window.__SET_VIEW__("COURSE_FINANCE")'
  });
  await new Promise((r) => setTimeout(r, 400));

  const financeEval = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const gemBtn = document.querySelector('[data-testid="finance-gem-btn"]');
        const trapBtn = document.querySelector('[data-testid="finance-trap-btn"]');
        return {
          hasGemBtn: !!gemBtn,
          hasTrapBtn: !!trapBtn
        };
      })()
    `,
    returnByValue: true,
  });
  const financeInfo = financeEval?.result?.value || { hasGemBtn: false, hasTrapBtn: false };

  // --- Step 4.6: Verify CERTIFICATE View & Download Canvas Button ---
  console.log('Testing CERTIFICATE view with download button...');
  await sendCommand('Runtime.evaluate', {
    expression: 'window.__SET_VIEW__("CERTIFICATE")'
  });
  await new Promise((r) => setTimeout(r, 400));

  const certEval = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const downloadBtn = document.querySelector('button[data-testid="download-cert-btn"]');
        return {
          hasDownloadBtn: !!downloadBtn,
          btnText: downloadBtn ? downloadBtn.innerText : ''
        };
      })()
    `,
    returnByValue: true,
  });
  const certInfo = certEval?.result?.value || { hasDownloadBtn: false };

  // Finish interactive CDP session cleanly
  ws.close();
  try { chrome.kill('SIGKILL'); } catch (e) {}

  // --- Step 4.7: Capture Screenshots via Headless Chrome CLI ---
  console.log('Capturing lobby-reset-smoke.png...');
  const shotTmpReset = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-shot-reset-'));
  const shotResetProc = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + shotTmpReset,
    '--window-size=420,800',
    '--screenshot=' + path.resolve(__dirname, '../lobby-reset-smoke.png'),
    `http://127.0.0.1:${port}/?modal=reset`
  ], { stdio: 'ignore' });
  await new Promise((resolve) => shotResetProc.on('close', resolve));
  try { fs.rmSync(shotTmpReset, { recursive: true, force: true }); } catch (e) {}
  console.log('Saved lobby-reset-smoke.png');

  console.log('Capturing chart-result-smoke.png...');
  const shotTmpChart = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-shot-chart-'));
  const shotChartProc = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + shotTmpChart,
    '--window-size=420,800',
    '--screenshot=' + path.resolve(__dirname, '../chart-result-smoke.png'),
    `http://127.0.0.1:${port}/?view=CHART_RESULT`
  ], { stdio: 'ignore' });
  await new Promise((resolve) => shotChartProc.on('close', resolve));
  try { fs.rmSync(shotTmpChart, { recursive: true, force: true }); } catch (e) {}
  console.log('Saved chart-result-smoke.png');

  console.log('Capturing dart-timer-smoke.png...');
  const shotTmpDart = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-shot-dart-'));
  const shotDartProc = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + shotTmpDart,
    '--window-size=420,800',
    '--screenshot=' + path.resolve(__dirname, '../dart-timer-smoke.png'),
    `http://127.0.0.1:${port}/?view=COURSE_DART`
  ], { stdio: 'ignore' });
  await new Promise((resolve) => shotDartProc.on('close', resolve));
  try { fs.rmSync(shotTmpDart, { recursive: true, force: true }); } catch (e) {}
  console.log('Saved dart-timer-smoke.png');

  console.log('Capturing roadmap-fee-tooltip-smoke.png...');
  const shotTmpRoadmap = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-shot-roadmap-'));
  const shotRoadmapProc = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + shotTmpRoadmap,
    '--window-size=420,800',
    '--screenshot=' + path.resolve(__dirname, '../roadmap-fee-tooltip-smoke.png'),
    `http://127.0.0.1:${port}/?view=ROADMAP`
  ], { stdio: 'ignore' });
  await new Promise((resolve) => shotRoadmapProc.on('close', resolve));
  try { fs.rmSync(shotTmpRoadmap, { recursive: true, force: true }); } catch (e) {}
  console.log('Saved roadmap-fee-tooltip-smoke.png');

  console.log('Capturing course-finance-smoke.png...');
  const shotTmpFin = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-shot-fin-'));
  const shotFinProc = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + shotTmpFin,
    '--window-size=420,800',
    '--screenshot=' + path.resolve(__dirname, '../course-finance-smoke.png'),
    `http://127.0.0.1:${port}/?view=COURSE_FINANCE`
  ], { stdio: 'ignore' });
  await new Promise((resolve) => shotFinProc.on('close', resolve));
  try { fs.rmSync(shotTmpFin, { recursive: true, force: true }); } catch (e) {}
  console.log('Saved course-finance-smoke.png');

  console.log('Capturing certificate-download-smoke.png...');
  const shotTmpCert = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-shot-cert-'));
  const shotCertProc = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + shotTmpCert,
    '--window-size=420,800',
    '--screenshot=' + path.resolve(__dirname, '../certificate-download-smoke.png'),
    `http://127.0.0.1:${port}/?view=CERTIFICATE`
  ], { stdio: 'ignore' });
  await new Promise((resolve) => shotCertProc.on('close', resolve));
  try { fs.rmSync(shotTmpCert, { recursive: true, force: true }); } catch (e) {}
  console.log('Saved certificate-download-smoke.png');

  console.log('Capturing promotion-celebration-smoke.png...');
  const shotTmpCeleb = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-shot-celeb-'));
  const shotCelebProc = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + shotTmpCeleb,
    '--window-size=420,800',
    '--screenshot=' + path.resolve(__dirname, '../promotion-celebration-smoke.png'),
    `http://127.0.0.1:${port}/?modal=celebration`
  ], { stdio: 'ignore' });
  await new Promise((resolve) => shotCelebProc.on('close', resolve));
  try { fs.rmSync(shotTmpCeleb, { recursive: true, force: true }); } catch (e) {}
  console.log('Saved promotion-celebration-smoke.png');

  cleanup();

  console.log('\n=== SMOKE TEST RUNTIME PROOF REPORT ===');
  console.log('• Lobby Text Length:', lobbyText.length);
  console.log('• Reset Button Exists:', hasResetBtn);
  console.log('• Reset Modal Opened:', modalInfo.isOpen);
  console.log('• Reset Modal Text Header:', modalInfo.text.split('\n')[0] || '');
  console.log('• Post-Reset Modal Closed:', postResetInfo.isModalClosed);
  console.log('• Post-Reset Toast Displayed:', postResetInfo.hasResetToast);
  console.log('• Post-Reset Lv.1 Status:', postResetInfo.hasDefaultLevel);
  console.log('• CHART_RESULT Text Length:', chartResultText.length);
  console.log('• Copy Button Clicked:', clickResult?.result?.value?.found === true);
  console.log('• Copy Toast Rendered:', toastInfo.hasToast);
  console.log('• DART Timer Gauge Exists:', dartInfo.hasGauge);
  console.log('• DART Countdown Rendered:', dartInfo.countdownText);
  console.log('• ROADMAP Fee Perk Btn Found:', roadmapClick?.result?.value?.found === true);
  console.log('• ROADMAP Fee Tooltip Rendered:', tooltipInfo.hasTooltip);
  console.log('• COURSE_FINANCE Gem Button Exists:', financeInfo.hasGemBtn);
  console.log('• CERTIFICATE Download Button Exists:', certInfo.hasDownloadBtn);
  console.log('• Console Errors Count:', consoleErrors.length);

  if (consoleErrors.length > 0) {
    console.error('❌ Console errors detected:', consoleErrors);
    process.exit(1);
  }

  if (!hasResetBtn || !modalInfo.isOpen || !postResetInfo.isModalClosed || !postResetInfo.hasResetToast) {
    console.error('❌ Reset data flow verification failed!');
    process.exit(1);
  }

  if (!clickResult?.result?.value?.found || !toastInfo.hasToast) {
    console.error('❌ Chart result copy flow verification failed!');
    process.exit(1);
  }

  if (!dartInfo.hasGauge || !dartInfo.hasCountdown) {
    console.error('❌ DART timer gauge verification failed!');
    process.exit(1);
  }

  if (!roadmapClick?.result?.value?.found || !tooltipInfo.hasTooltip) {
    console.error('❌ Roadmap fee tooltip verification failed!');
    process.exit(1);
  }

  if (!financeInfo.hasGemBtn || !certInfo.hasDownloadBtn) {
    console.error('❌ Finance buttons or Certificate download button verification failed!');
    process.exit(1);
  }

  console.log('✅ Step 4 Runtime Proof PASSED: 0 console errors, all Sprint 1 & Sprint 2 tasks verified in runtime.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Smoke test failure:', err);
  process.exit(1);
});
