import React, { useState, useEffect } from 'react';

const ExchangeSection = () => {
    // 1. Configuration: Define YOUR Exchange Rates Here
    // ඔයාට අවශ්‍ය විදිහට මේ රේට්ස් වෙනස් කරන්න.
    const exchangeRates = {
        'USDT': {
            'LKR': 305.50, // You sell 1 USDT for 305.50 LKR
            'SKRILL': 1.02, // 1 USDT = 1.02 Skrill
            'BTC': 0.000015
        },
        'BTC': {
            'LKR': 20500000.00,
            'USDT': 67000.00
        },
        'ETH': {
            'LKR': 1200000.00,
            'USDT': 3800.00
        },
        'SKRILL': {
            'LKR': 295.00, // Skrill rate is often slightly lower
            'USDT': 0.97   // Selling Skrill for USDT
        }
    };

    // 2. State Management (React Hook)
    const [sendAmount, setSendAmount] = useState(100);
    const [sendCurrency, setSendCurrency] = useState('USDT');
    const [getCurrency, setGetCurrency] = useState('LKR');
    const [getAmount, setGetAmount] = useState('');
    const [rateText, setRateText] = useState('Loading...');

    // 3. Calculation Logic (Runs whenever inputs change)
    useEffect(() => {
        calculateExchange();
    }, [sendAmount, sendCurrency, getCurrency]);


    const calculateExchange = () => {
        const amount = parseFloat(sendAmount);

        // Validation
        if (isNaN(amount) || amount < 0) {
            setGetAmount("Enter valid amount");
            setRateText("---");
            return;
        }

        // Handle same currency
        if (sendCurrency === getCurrency) {
            setGetAmount(amount.toFixed(2));
            setRateText(`1 ${sendCurrency} = 1 ${getCurrency}`);
            return;
        }

        // Find Rate
        let rate = 0;
        if (exchangeRates[sendCurrency] && exchangeRates[sendCurrency][getCurrency]) {
            rate = exchangeRates[sendCurrency][getCurrency];
        } else {
            setGetAmount("N/A (Not Supported)");
            setRateText("Pair currently not supported");
            return;
        }

        // Final Calculation
        const finalAmount = amount * rate;

        // Formatting decimals (BTC/ETH need more decimals)
        let decimals = (getCurrency === 'BTC' || getCurrency === 'ETH') ? 6 : 2;
        setGetAmount(finalAmount.toFixed(decimals));

        setRateText(`Exchange Rate: 1 ${sendCurrency} ≈ ${rate.toFixed(decimals)} ${getCurrency}`);
    };


    // 4. JSX Structure (The visual part)
    return (
        // IMPORTANT: Added ID for navbar link
        <section className="exchange-service" id="exchange-service">
            <h2 className="heading">Instant <span>Exchange</span></h2>

            <div className="exchange-dashboard-container">
                <form id="exchange-dashboard-form" onSubmit={(e) => e.preventDefault()}>
                    
                    <div className="exchange-grid">
                        {/* "You Send" Column */}
                        <div className="exchange-card send-card">
                            <div className="card-header">
                                <h3>You Send</h3>
                                <span className="balance-label">Estimated</span>
                            </div>
                            <div className="input-container">
                                <input 
                                    type="number" 
                                    value={sendAmount}
                                    onChange={(e) => setSendAmount(e.target.value)}
                                    placeholder="0.00" 
                                    min="0" 
                                    step="any" 
                                />
                                <div className="currency-selector">
                                    <select 
                                        value={sendCurrency} 
                                        onChange={(e) => setSendCurrency(e.target.value)}
                                    >
                                        <option value="USDT">USDT (Tether)</option>
                                        <option value="BTC">BTC (Bitcoin)</option>
                                        <option value="ETH">ETH (Ethereum)</option>
                                        <option value="SKRILL">Skrill USD</option>
                                    </select>
                                </div>
                            </div>
                            <p className="helper-text">Enter amount to send</p>
                        </div>

                        {/* Swap Icon Middle (using Boxicons as per your existing site) */}
                        <div className="swap-indicator">
                            <i className='bx bx-right-arrow-alt'></i>
                        </div>

                        {/* "You Get" Column */}
                        <div className="exchange-card get-card">
                             <div className="card-header">
                                <h3>You Get</h3>
                                <span className="balance-label">Guaranteed</span>
                            </div>
                            <div className="input-container get-container">
                                {/* Readonly input for the result */}
                                <input 
                                    type="text" 
                                    value={getAmount} 
                                    readOnly
                                    placeholder="0.00" 
                                />
                                 <div className="currency-selector">
                                    <select 
                                        value={getCurrency}
                                        onChange={(e) => setGetCurrency(e.target.value)}
                                    >
                                        <option value="LKR">LKR (Bank Transfer)</option>
                                        <option value="USDT">USDT (Tether)</option>
                                        <option value="SKRILL">Skrill USD</option>
                                    </select>
                                </div>
                            </div>
                            <p className="helper-text">Expected amount to receive</p>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="exchange-summary">
                        <div className="summary-row">
                            <span>Rate Info:</span>
                            <span id="current-exchange-rate" style={{color: 'var(--main-color)'}}>{rateText}</span>
                        </div>
                        <div className="summary-row">
                            <span>Transaction Fees:</span>
                            <span className="fee-text" style={{color: '#00ff00'}}>No Extra Fees</span>
                        </div>
                    </div>

                    <button type="button" className="btn exchange-submit-btn" style={{width: '100%', marginTop: '1rem'}}>Proceed to Exchange</button>
                </form>
            </div>
        </section>
    );
};

export default ExchangeSection;
