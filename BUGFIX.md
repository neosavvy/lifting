## BUG LIST

1. Make sure we can highlight the current week based on the most recent completed week or lift
   - For e.g. if the user has completed the first week

2. Clipboard API fails when clicking 'Flex on 'Em'
   - Error: Cannot read properties of undefined (reading 'writeText')
   - Need to add error handling and fallback for clipboard operations
   - Should show user feedback when copy fails