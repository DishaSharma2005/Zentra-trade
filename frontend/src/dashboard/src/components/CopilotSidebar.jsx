import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { apiFetch } from "../../../utils/apiFetch";
import "./CopilotSidebar.css";

const CopilotSidebar = ({ userId, isMobile }) => {
  // Collapse by default on mobile so it doesn't block the screen initially
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [mode, setMode] = useState("Copilot"); // "Manual" or "Copilot"
  const [logs, setLogs] = useState([
    "[system] AI Copilot initialized",
    "[system] Standing by in Assisted mode..."
  ]);
  const [response, setResponse] = useState(
    "Hello! I am your AI Investing Copilot. Switch to **Copilot Mode** and click **Draft Next Trade** to let me propose risk-managed actions, or ask me any question below."
  );
  const [draftedTrade, setDraftedTrade] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);

  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Sync open state if the user changes screen size
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const triggerCopilotAction = async (actionType, customText = "") => {
    if (loading) return;

    setLoading(true);
    setLogs((prev) => [
      ...prev,
      `[info] Invoking Copilot agent: ${actionType.toUpperCase()}...`,
      `[info] Mode is set to ${mode}`
    ]);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await apiFetch(`${API_URL}/api/copilot/suggest`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          mode,
          actionType,
          userPrompt: customText || inputText
        })
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = null;
      }

      if (!res.ok) {
        if (data) {
          if (data.reasoningLogs && data.reasoningLogs.length > 0) {
            setLogs((prev) => [...prev, ...data.reasoningLogs]);
          }
          if (data.textResponse) {
            setResponse(data.textResponse);
          }
        }
        throw new Error((data && data.error) || "HTTP Error " + res.status);
      }
      
      // Update terminal reasoning logs
      if (data.reasoningLogs && data.reasoningLogs.length > 0) {
        setLogs((prev) => [...prev, ...data.reasoningLogs]);
      }

      // Update response copy
      if (data.textResponse) {
        setResponse(data.textResponse);
      }

      // Update trade suggestions
      if (data.draftedTrade) {
        setDraftedTrade(data.draftedTrade);
        setLogs((prev) => [
          ...prev,
          `[proposal] Drafted BUY/SELL proposal for ${data.draftedTrade.symbol}`
        ]);
      } else {
        setDraftedTrade(null);
        if (actionType === "draft_trade") {
          setLogs((prev) => [
            ...prev,
            `[warn] Could not draft trade proposal. Check cash balance or current holdings.`,
            `[info] Suggestion: Top up wallet via 'Add Funds' or buy holdings manually first.`
          ]);
        }
      }

      setInputText("");
    } catch (err) {
      console.error(err);
      setLogs((prev) => [...prev, `[error] Agent call failed: ${err.message}`]);
      toast.error("Failed to fetch suggestion");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTrade = async () => {
    if (!draftedTrade || executing) return;

    setExecuting(true);
    setLogs((prev) => [
      ...prev,
      `[info] Executing trade: ${draftedTrade.action} ${draftedTrade.qty}x ${draftedTrade.symbol}...`,
      `[info] Gating balance security filters...`
    ]);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await apiFetch(`${API_URL}/api/orders`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          symbol: draftedTrade.symbol,
          qty: draftedTrade.qty,
          price: draftedTrade.price,
          type: draftedTrade.action
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setLogs((prev) => [...prev, `[error] Execution aborted: ${data.error}`]);
        toast.error(data.error || "Trade failed");
        return;
      }

      setLogs((prev) => [
        ...prev,
        `[ok] Transaction approved by broker pipeline`,
        `[ok] Order status set to PENDING (clearing house delay initialized)`
      ]);

      toast.success(`${draftedTrade.action} order placed successfully!`);
      setDraftedTrade(null); // Clear proposal after execution
    } catch (err) {
      console.error(err);
      setLogs((prev) => [...prev, `[error] Broker API failure: ${err.message}`]);
      toast.error("Failed to execute order");
    } finally {
      setExecuting(false);
    }
  };

  if (!isOpen) {
    return (
      <div 
        className={`copilot-collapsed-trigger ${isMobile ? "mobile-floating" : ""}`} 
        onClick={() => setIsOpen(true)} 
        title="Expand AI Copilot Workspace"
      >
        <span>🤖</span>
        {!isMobile && <span className="text">AI COPILOT</span>}
      </div>
    );
  }

  return (
    <>
      {/* Translucent backdrop click-away strictly for mobile drawer */}
      {isMobile && (
        <div className="copilot-mobile-backdrop" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`copilot-sidebar-container ${isMobile ? "mobile-drawer" : ""}`}>
        {/* Sidebar Header */}
        <div className="copilot-header">
          <div className="title">
            <span>🤖</span>
            <strong>Copilot Workspace</strong>
          </div>
          <button className="collapse-btn" onClick={() => setIsOpen(false)} title="Collapse sidebar">
            ✕
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="mode-toggle-bar">
          <button
            className={mode === "Manual" ? "active" : ""}
            onClick={() => setMode("Manual")}
          >
            Manual
          </button>
          <button
            className={mode === "Copilot" ? "active" : ""}
            onClick={() => setMode("Copilot")}
          >
            Copilot (Assisted)
          </button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-panel">
          <button onClick={() => triggerCopilotAction("analyze_portfolio")} disabled={loading}>
            📊 Analyze Portfolio
          </button>
          <button onClick={() => triggerCopilotAction("check_risk")} disabled={loading}>
            🛡️ Risk Audit
          </button>
          {mode === "Copilot" && (
            <button className="btn-glowing" onClick={() => triggerCopilotAction("draft_trade")} disabled={loading}>
              ✨ Draft Next Trade
            </button>
          )}
        </div>

        {/* Terminal Reasoning Console */}
        <div className="terminal-console-container">
          <div className="terminal-header">COGNITIVE REASONING TERMINAL</div>
          <div className="terminal-body">
            {logs.map((log, index) => {
              let className = "log-info";
              if (log.includes("[error]")) className = "log-error";
              if (log.includes("[ok]") || log.includes("[success]")) className = "log-success";
              if (log.includes("[proposal]")) className = "log-proposal";
              if (log.includes("[system]")) className = "log-system";
              if (log.includes("[warn]")) className = "log-error"; // warn inherits soft red

              return (
                <div key={index} className={`log-line ${className}`}>
                  {log}
                </div>
              );
            })}
            {loading && <div className="log-line log-loading">⚡ AI Agent thinking...</div>}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Markdown AI Output */}
        <div className="ai-response-container">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>

        {/* Glowing Dynamic Trade Suggestion Card */}
        {draftedTrade && (
          <div className="trade-proposal-card">
            <div className="proposal-header">
              <span>PROPOSED TRADE</span>
              <span className={`proposal-badge ${draftedTrade.action === "BUY" ? "buy" : "sell"}`}>
                {draftedTrade.action}
              </span>
            </div>
            <div className="proposal-body">
              <h3>{draftedTrade.symbol}</h3>
              <div className="proposal-row">
                <div>
                  <span className="label">Quantity</span>
                  <span className="value">{draftedTrade.qty}</span>
                </div>
                <div>
                  <span className="label">Estimated Price</span>
                  <span className="value">₹{draftedTrade.price}</span>
                </div>
              </div>
              <p className="proposal-reason">"{draftedTrade.reason}"</p>
            </div>
            <button
              className={`btn-approve-execute ${draftedTrade.action === "BUY" ? "buy" : "sell"}`}
              onClick={handleApproveTrade}
              disabled={executing}
            >
              {executing ? "Placing Order..." : "Approve & Execute"}
            </button>
          </div>
        )}

        {/* Chat input box */}
        <div className="copilot-input-area">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Copilot anything..."
            onKeyDown={(e) => e.key === "Enter" && triggerCopilotAction("chat")}
            disabled={loading}
          />
          <button onClick={() => triggerCopilotAction("chat")} disabled={loading || !inputText.trim()}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default CopilotSidebar;
