// pages/api/webhook.js
import { exec } from 'child_process';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const payload = req.body;

      // Check for a push event and ensure it’s for the `main` branch
      if (payload.ref === 'refs/heads/main') {
        console.log('Received commit on the main branch');

        // Run the git pull command to update the local repository
        exec('git stash && git pull origin main && npm run build && PORT=5000 npm start', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing git pull: ${stderr}`);
            return res.status(500).json({ message: 'Git pull failed' });
          }
          console.log(stdout);
          res.status(200).json({ message: 'Successfully updated repository' });
        });
      } else {
        console.log('Not a push to the main branch, ignoring...');
        res.status(200).json({ message: 'Not a push to the main branch' });
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
