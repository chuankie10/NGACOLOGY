package com.ngacology.app

import android.app.Activity
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private val gameUrl = "http://127.0.0.1:3000"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = true
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true
            settings.builtInZoomControls = false
            settings.displayZoomControls = false
            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    val url = request?.url?.toString() ?: return false
                    return !(url.startsWith("http://127.0.0.1:3000") ||
                        url.startsWith("https://chuankie10.github.io/NGACOLOGY/"))
                }

                override fun onReceivedError(
                    view: WebView?,
                    request: WebResourceRequest?,
                    error: android.webkit.WebResourceError?
                ) {
                    if (request?.isForMainFrame == true) showBridgeHelp()
                }
            }
        }
        setContentView(FrameLayout(this).apply {
            addView(webView, FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            ))
        })
        if (savedInstanceState == null) webView.loadUrl(gameUrl)
        else webView.restoreState(savedInstanceState)
    }

    private fun showBridgeHelp() {
        val html = """
            <!doctype html><html lang="id"><meta name="viewport" content="width=device-width,initial-scale=1">
            <body style="margin:0;background:#10091f;color:#fff8ff;font-family:system-ui;display:grid;min-height:100vh;place-items:center;text-align:center;padding:24px;box-sizing:border-box">
            <main style="max-width:420px"><div style="font-size:56px">🧠🎓</div>
            <h1 style="color:#ffe16b">NGACOLOGY</h1>
            <h2>Server game belum aktif</h2>
            <p>Buka Termux dan jalankan:</p>
            <pre style="background:#21143b;padding:14px;border-radius:12px;white-space:pre-wrap">cd ~/NGACOLOGY/server && npm start</pre>
            <p>Biarkan Termux berjalan, lalu tekan tombol di bawah.</p>
            <button onclick="location.reload()" style="padding:14px 22px;border:0;border-radius:12px;background:#ffad35;font-weight:bold">COBA LAGI</button>
            </main></body></html>
        """.trimIndent()
        webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    @Deprecated("Deprecated in Android")
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) webView.goBack()
        else super.onBackPressed()
    }

    override fun onDestroy() {
        if (::webView.isInitialized) {
            webView.stopLoading()
            webView.destroy()
        }
        super.onDestroy()
    }
}
