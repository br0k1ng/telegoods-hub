
# Deployment Instructions for CIOT Rose Website

## Build Process

Since the hosting environment uses Node.js 14.16 which is older than what modern Vite projects typically use, the recommended approach is to build the project locally and upload the static files.

### Step 1: Build the Project
```bash
# Install dependencies
npm install

# Build the project
npm run build
```

This will create a `dist` folder with all the static files needed for your website.

### Step 2: Upload to Hosting

Upload all files from the `dist` folder to:
```
/home/a1097500/domains/ciotrose.ru/public_html/
```

You can use FTP, SFTP, or the hosting provider's file manager to upload the files.

### Step 3: Configure Nginx/Apache

Create or modify `.htaccess` file in your root directory with the following:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures that all routes in your React app work correctly.

### Step 4: Environment Variables

If your app uses environment variables (for Telegram bot, CDEK API, etc.), you will need to:

1. Create a `.env` file in your local project with all required variables
2. Build the project with these environment variables
3. Verify in the built files that the variables are correctly embedded

Alternatively, you can modify the built `index.html` to include a script that sets these variables:

```html
<script>
  window.ENV = {
    TELEGRAM_BOT_TOKEN: "your-telegram-bot-token",
    TELEGRAM_CHAT_ID: "your-telegram-chat-id",
    // Add other environment variables here
  };
</script>
```

Add this script before the main script tags in the built index.html file.

## Troubleshooting

1. **404 Not Found errors when refreshing pages**: Ensure your `.htaccess` file is correctly set up as described above.
2. **API calls not working**: Make sure CORS is properly configured if calling external APIs.
3. **Telegram bot not working**: Verify that the bot token and chat ID are correctly set.

## Important Notes

- This is a static website deployment. There is no server-side rendering.
- All API calls are made directly from the browser.
- The Telegram and CDEK functionality will require proper environment variable configuration.
