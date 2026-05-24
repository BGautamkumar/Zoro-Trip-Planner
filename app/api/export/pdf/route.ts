import { NextRequest, NextResponse } from 'next/server';

/**
 * PDF Export endpoint
 * Generates a downloadable HTML-based printable view of a trip itinerary.
 * Uses server-side HTML rendering (no external PDF library needed).
 * The client opens this in a new tab and uses browser print → Save as PDF.
 */
export async function POST(req: NextRequest) {
  try {
    const { tripData, budget } = await req.json();

    if (!tripData) {
      return NextResponse.json({ error: 'tripData is required' }, { status: 400 });
    }

    const destination = tripData.destination || 'Trip';
    const duration = tripData.duration || '';
    const origin = tripData.origin || '';
    const budgetLevel = tripData.budget || '';
    const groupSize = tripData.group_size || '';

    // Build a print-friendly HTML document
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trip to ${escapeHtml(destination)} — Zoro Trip Planner</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1a1a2e; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
    
    .header { background: linear-gradient(135deg, #0B1D3A 0%, #1B9AAA 100%); color: white; padding: 32px; border-radius: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .header .meta { display: flex; gap: 16px; font-size: 13px; opacity: 0.85; flex-wrap: wrap; }
    .header .meta span { display: flex; align-items: center; gap: 4px; }
    
    .budget-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .budget-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; }
    .budget-card .emoji { font-size: 20px; margin-bottom: 4px; }
    .budget-card .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .budget-card .value { font-size: 18px; font-weight: 700; color: #0B1D3A; }
    .budget-total { background: #0B1D3A; color: white; padding: 16px 24px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .budget-total .label { font-size: 14px; opacity: 0.8; }
    .budget-total .value { font-size: 24px; font-weight: 700; }
    
    .day-card { border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 20px; overflow: hidden; page-break-inside: avoid; }
    .day-header { background: #f1f5f9; padding: 16px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #e2e8f0; }
    .day-num { width: 40px; height: 40px; background: linear-gradient(135deg, #0B1D3A, #1B9AAA); color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
    .day-title { font-weight: 600; font-size: 16px; }
    .day-subtitle { font-size: 12px; color: #64748b; }
    
    .activities { padding: 16px 20px; }
    .activity { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .activity:last-child { border-bottom: none; }
    .activity-time { font-size: 11px; font-weight: 600; color: #1B9AAA; min-width: 100px; padding-top: 2px; }
    .activity-name { font-weight: 600; font-size: 14px; }
    .activity-detail { font-size: 12px; color: #64748b; margin-top: 2px; }
    .activity-price { font-size: 11px; color: #059669; font-weight: 600; margin-top: 2px; }
    
    .hotel-section { padding: 12px 20px; background: #fafafa; border-top: 1px solid #e2e8f0; }
    .hotel-title { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .hotel { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 13px; }
    .hotel-name { font-weight: 600; }
    .hotel-price { color: #059669; font-weight: 600; }
    
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
    .footer a { color: #1B9AAA; text-decoration: none; }
    
    .print-btn { position: fixed; top: 20px; right: 20px; background: #1B9AAA; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; z-index: 100; box-shadow: 0 4px 12px rgba(27, 154, 170, 0.3); }
    .print-btn:hover { background: #147A87; }
    
    @media print {
      body { padding: 20px; }
      .print-btn { display: none; }
      .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .day-num { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .budget-total { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save PDF</button>

  <div class="header">
    <h1>✈️ Trip to ${escapeHtml(destination)}</h1>
    <div class="meta">
      ${origin ? `<span>📍 From ${escapeHtml(origin)}</span>` : ''}
      ${duration ? `<span>📅 ${escapeHtml(duration)}</span>` : ''}
      ${budgetLevel ? `<span>💰 ${escapeHtml(budgetLevel)} budget</span>` : ''}
      ${groupSize ? `<span>👥 ${escapeHtml(groupSize)}</span>` : ''}
    </div>
  </div>

  ${budget ? `
  <div class="budget-summary">
    <div class="budget-card"><div class="emoji">🏨</div><div class="label">Hotels</div><div class="value">${formatPdfAmount(budget.hotels)}</div></div>
    <div class="budget-card"><div class="emoji">🍽️</div><div class="label">Food</div><div class="value">${formatPdfAmount(budget.food)}</div></div>
    <div class="budget-card"><div class="emoji">🚗</div><div class="label">Transport</div><div class="value">${formatPdfAmount(budget.transport)}</div></div>
    <div class="budget-card"><div class="emoji">🎯</div><div class="label">Activities</div><div class="value">${formatPdfAmount(budget.activities)}</div></div>
  </div>
  <div class="budget-total">
    <span class="label">Estimated Total Budget</span>
    <span class="value">${formatPdfAmount(budget.total)}</span>
  </div>
  ` : ''}

  ${(tripData.itinerary || []).map((day: any) => `
    <div class="day-card">
      <div class="day-header">
        <div class="day-num">${day.day}</div>
        <div>
          <div class="day-title">Day ${day.day}${day.day_plan ? ` — ${escapeHtml(day.day_plan)}` : ''}</div>
          <div class="day-subtitle">${escapeHtml(day.best_time_to_visit_day || '')}</div>
        </div>
      </div>
      <div class="activities">
        ${(day.activities || []).map((a: any) => `
          <div class="activity">
            <div class="activity-time">${escapeHtml(a.best_time_to_visit || '')}</div>
            <div>
              <div class="activity-name">${escapeHtml(a.place_name || '')}</div>
              <div class="activity-detail">${escapeHtml(a.place_details || '')}</div>
              ${a.ticket_pricing && a.ticket_pricing !== 'Price not available' ? `<div class="activity-price">${escapeHtml(a.ticket_pricing)}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      ${day.suggested_hotels?.length ? `
        <div class="hotel-section">
          <div class="hotel-title">🏨 Suggested Hotels</div>
          ${day.suggested_hotels.map((h: any) => `
            <div class="hotel">
              <span class="hotel-name">${escapeHtml(h.hotel_name || '')}</span>
              <span class="hotel-price">${escapeHtml(h.price_per_night || '')}/night</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div class="footer">
    <p>Generated by <a href="https://zoro-trip-planner.vercel.app">Zoro Trip Planner</a> · ${new Date().toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    console.error('PDF export error:', err);
    return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatPdfAmount(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
