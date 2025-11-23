document.addEventListener('DOMContentLoaded', function() {
    const syncButton = document.getElementById('syncButton');
    const statusText = document.getElementById('statusText');
    const indicator = document.getElementById('indicator');
    const statusContainer = document.getElementById('status');

    // Update status message and indicator
    function updateStatus(message, type = 'info') {
        statusText.textContent = message;
        statusContainer.className = `status ${type}`;
        indicator.className = `indicator ${type}`;
    }

    // Main sync function
    async function syncLeetCodeSession() {
        try {
            syncButton.disabled = true;
            syncButton.textContent = 'Syncing...';
            updateStatus('Extracting cookies...', 'info');

            // Query LeetCode cookies
            const [leetcodeSession, csrfToken] = await Promise.all([
                getCookie('LEETCODE_SESSION', 'leetcode.com'),
                getCookie('csrftoken', 'leetcode.com')
            ]);

            if (!leetcodeSession) {
                throw new Error('LeetCode session not found. Please log in to LeetCode.');
            }

            if (!csrfToken) {
                throw new Error('CSRF token not found. Please refresh LeetCode.');
            }

            // Create hidden form for secure POST submission
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'http://localhost:3000/api/auth/sync-cookies';
            form.target = '_blank'; // Open in new tab
            form.style.display = 'none';

            // Add hidden inputs for the tokens
            const sessionInput = document.createElement('input');
            sessionInput.type = 'hidden';
            sessionInput.name = 'leetcode_session';
            sessionInput.value = leetcodeSession;

            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrftoken';
            csrfInput.value = csrfToken;

            // Append inputs to form
            form.appendChild(sessionInput);
            form.appendChild(csrfInput);

            // Append form to body and submit
            document.body.appendChild(form);
            
            updateStatus('Submitting...', 'success');
            form.submit();

            // Clean up and close
            document.body.removeChild(form);
            setTimeout(() => window.close(), 1000);

        } catch (error) {
            console.error('Sync error:', error);
            updateStatus(error.message, 'error');
            syncButton.disabled = false;
            syncButton.textContent = 'Sync Session';
        }
    }

    // Helper function to get cookies
    function getCookie(name, domain) {
        return new Promise((resolve, reject) => {
            chrome.cookies.get({ url: `https://${domain}`, name }, (cookie) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(cookie ? cookie.value : null);
                }
            });
        });
    }

    // Attach event listener
    syncButton.addEventListener('click', syncLeetCodeSession);

    // Initial status
    updateStatus('Ready to sync', 'info');
});
