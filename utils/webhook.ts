import { ApprovalStatus } from "../types";

// Helper for robust fetching with timeout and no-cors fallback
async function safeWebhookFetch(url: string, payload: any): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    // Attempt 1: Standard JSON POST
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Attempt 2: No-CORS fallback
    // This allows sending data to servers that don't support CORS headers for client-side requests.
    // The content-type will likely default to text/plain or opaque.
    try {
      const fallbackController = new AbortController();
      const fallbackTimeout = setTimeout(() => fallbackController.abort(), 10000);
      
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
        signal: fallbackController.signal,
      });
      
      clearTimeout(fallbackTimeout);
      // In no-cors mode, we can't check response.ok, but if it didn't throw, it was sent.
      return true;
    } catch (fallbackError) {
      console.warn(`[Webhook] Failed to send to ${url}`, fallbackError);
      return false;
    }
  }
}

export const triggerApprovalWebhook = async (
  prdId: string, 
  status: ApprovalStatus, 
  prdTitle: string,
  webhookUrl?: string,
  comment?: string,
  approverName?: string,
  approverEmail?: string
) => {
  const payload = {
    event: 'prd_approval_status_changed',
    prdId,
    title: prdTitle,
    status,
    approver: {
      name: approverName || 'Anonymous',
      email: approverEmail || 'Not provided'
    },
    comment: comment || '',
    timestamp: new Date().toISOString()
  };

  console.log(`[Webhook] Triggering approval event...`, payload);

  if (webhookUrl && webhookUrl.startsWith('http')) {
    await safeWebhookFetch(webhookUrl, payload);
    console.log(`[Webhook] Event sent.`);
  } else {
    console.log(`[Webhook] No valid Webhook URL configured.`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  return true;
};

export const testWebhookConnection = async (webhookUrl: string): Promise<boolean> => {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return false;

  // Payload matches the structure of the real approval event
  // so users can verify how their system handles the data schema.
  const payload = {
    event: 'prd_approval_status_changed',
    prdId: 'test_prd_id_12345',
    title: 'Test Product Requirements Document',
    status: 'approved',
    approver: {
      name: 'Test Approver',
      email: 'approver@example.com'
    },
    comment: 'This is a test event to verify webhook payload structure and connectivity.',
    timestamp: new Date().toISOString(),
    isTest: true
  };

  return await safeWebhookFetch(webhookUrl, payload);
};