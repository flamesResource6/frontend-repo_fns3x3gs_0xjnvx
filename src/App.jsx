import React, { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'

function App() {
  const [lines, setLines] = useState([])
  const [running, setRunning] = useState(false)
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [connectedPulse, setConnectedPulse] = useState(false)
  const terminalRef = useRef(null)
  const intervalRef = useRef(null)

  const addLine = (text) => {
    setLines((prev) => [...prev, `${new Date().toLocaleTimeString()}  ${text}`])
  }

  const startSimulation = () => {
    if (running) return
    setLines([])
    setRunning(true)
    setScreenshotUrl('')

    const script = [
      '[SIM] Initializing spoofed runtime... OK',
      '[SIM] Booting fake orchestration node: brawl-core-01... OK',
      '[SIM] Mounting mock data volumes /srv/brawl/*.dat... OK',
      '[SIM] Spinning up imaginary containers: api, matchmaker, assets, chat',
      '[SIM] Faking TLS certificates for client handshake... OK',
      '[SIM] Launching pseudo master server on 0.0.0.0:9339',
      '[SIM] Generating decoy player shards (eu-1, na-1, ap-1)',
      '[SIM] Seeded 12,842 phantom accounts for load testing',
      '[SIM] Connecting to "Brawl Stars" client servers... (simulated)',
      '[SIM] Route via 10.0.0.42 -> 198.51.100.12 -> 203.0.113.77 (fake)',
      '[SIM] Handshake SYN -> SYN-ACK -> ACK (entirely mocked)',
      '[SIM] Negotiated cipher suite TLS_FAKE_WITH_AES_256_GCM_SHA384',
      '[SIM] Bypassing Supercell Shield... not really — just pretend',
      '[SIM] Downloading asset bundle brawl_assets_v99.pak (0.0/1.2GB)',
      '[SIM] Download complete (instantly, because this is a simulation)',
      '[SIM] Starting decoy matchmaker and room allocator',
      '[SIM] Emitting telemetry to nowhere://blackhole',
      '[SIM] Fake servers are now "running". No real connections made.',
    ]

    let i = 0
    intervalRef.current = setInterval(() => {
      if (i < script.length) {
        addLine(script[i])
        i++
      } else {
        addLine('[SIM] Idle loop tick...')
        setConnectedPulse((p) => !p)
      }
    }, 500)
  }

  const stopSimulation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const takeScreenshot = async () => {
    try {
      // Hide the button before capture by adding a class flag
      const container = terminalRef.current
      if (!container) return

      // Temporarily add a class so UI knows it's capturing (hides controls)
      container.classList.add('capturing')
      const canvas = await html2canvas(container, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
      })
      const dataUrl = canvas.toDataURL('image/png')
      setScreenshotUrl(dataUrl)
      container.classList.remove('capturing')
      stopSimulation()
    } catch (e) {
      addLine(`[SIM] Screenshot failed: ${e.message}`)
    }
  }

  const reset = () => {
    setScreenshotUrl('')
    setLines([])
    setRunning(false)
    setConnectedPulse(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-black text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${connectedPulse ? 'bg-green-400' : 'bg-emerald-600'} shadow`}></div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Brawl Stars Server Console — Simulation</h1>
          </div>
          <span className="text-xs sm:text-sm px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">SIMULATION • NO REAL CONNECTIONS</span>
        </div>

        {/* Terminal / Capture Area */}
        {screenshotUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-xl">
            <img
              src={screenshotUrl}
              alt="Captured terminal screenshot"
              className="w-full h-auto block"
            />
          </div>
        ) : (
          <div ref={terminalRef} className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/80">
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="ml-3 text-xs text-zinc-400">/usr/local/sim/brawl-ops</span>
              </div>
              <div className="text-xs text-zinc-400">user@sim-host</div>
            </div>

            {/* Content */}
            <div className="relative p-4 sm:p-6 font-mono text-[11px] sm:text-sm leading-relaxed min-h-[420px] max-h-[60vh] overflow-auto bg-gradient-to-b from-black to-zinc-950">
              <pre className="whitespace-pre-wrap text-zinc-200 select-text">
{lines.length === 0 ? '$ ./run_fake_brawl_stack --dangerously-pretend\n' : ''}
{lines.join('\n')}
              </pre>

              {/* Watermark to make it clear it's fake */}
              <div className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-zinc-500">All visuals are fabricated for entertainment.</div>

              {/* Overlay control bar (hidden during capture via CSS) */}
              <div className="controls absolute top-3 right-3 flex gap-2">
                {!running && (
                  <button onClick={startSimulation} className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow">
                    Start Simulation
                  </button>
                )}
                {running && (
                  <button onClick={stopSimulation} className="px-3 py-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-medium shadow">
                    Stop
                  </button>
                )}
                {/* Screenshot button must not appear in screenshot */}
                <button onClick={takeScreenshot} className="screenshot-btn px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium shadow">
                  Screenshot
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions (kept outside capture so they won't be in the image) */}
        <div className="mt-4 flex items-center gap-3">
          {screenshotUrl && (
            <a download="brawl-sim-console.png" href={screenshotUrl} className="px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium">
              Download Image
            </a>
          )}
          <button onClick={reset} className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium">
            Reset
          </button>
        </div>
      </div>

      {/* Style overrides for capture */}
      <style>{`
        /* Hide controls entirely when capturing so the button never shows up in the image */
        .capturing .controls, .capturing .screenshot-btn { display: none !important; }
      `}</style>
    </div>
  )
}

export default App
