# Custom Domain Deployment Guide - rosecitydev.tech

🎯 **Target Domain**: https://rosecitydev.tech

## 🚀 Current Status

Your portfolio is configured to deploy to your custom domain `rosecitydev.tech`. Here's what's been set up and what you need to do to complete the deployment.

## ✅ Configuration Complete

### Files Updated:
- ✅ `.env.production` - Updated with custom domain configuration
- ✅ `render.yaml` - Updated with domain settings
- ✅ `README.md` - Already references your custom domain

## 🔧 Render Dashboard Setup Required

To complete your custom domain setup, you need to configure your Render services:

### Step 1: Upgrade Render Plan (Required for Custom Domains)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your `portfolio-frontend` service
3. Go to **Settings** → **Plan**
4. Upgrade to **Starter Plan** ($7/month) or higher
   - Custom domains require a paid plan
   - Includes SSL certificates
   - Better performance and uptime

### Step 2: Add Custom Domain in Render

1. In your `portfolio-frontend` service dashboard
2. Go to **Settings** → **Custom Domains**
3. Click **Add Custom Domain**
4. Add both:
   - `rosecitydev.tech`
   - `www.rosecitydev.tech`

### Step 3: Configure DNS Records

Render will provide you with DNS configuration. You'll need to add these records to your domain registrar:

**For Root Domain (rosecitydev.tech):**
```
Type: A
Name: @
Value: [Render IP Address - they'll provide this]
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: [Your-Service-Name].onrender.com
```

**Alternative (Recommended):**
```
Type: ALIAS/ANAME (if supported by your DNS provider)
Name: @
Value: [Your-Service-Name].onrender.com

Type: CNAME
Name: www  
Value: rosecitydev.tech
```

## 🌐 DNS Configuration Steps

### If using Cloudflare (Recommended):

1. **Log into Cloudflare Dashboard**
2. **Select your domain: rosecitydev.tech**
3. **Go to DNS → Records**
4. **Add/Update these records:**

```
Type: A
Name: @
Value: [Render IP]
Proxy: ☑️ Proxied (Orange Cloud)

Type: CNAME
Name: www
Value: rosecitydev.tech
Proxy: ☑️ Proxied (Orange Cloud)
```

5. **Set SSL/TLS Mode to "Full (Strict)"** in SSL/TLS settings

### If using other DNS providers (GoDaddy, Namecheap, etc.):

Follow the same pattern but without Cloudflare proxy options.

## 🔄 Deployment Process

After configuring the domain in Render:

### Option 1: Automatic Deployment
```bash
# Commit the updated configuration
git add .
git commit -m "Configure custom domain rosecitydev.tech

- Update .env.production with custom domain
- Update render.yaml with domain configuration
- Add deployment documentation"

# Push to trigger automatic deployment
git push origin main
```

### Option 2: Manual Deployment via Render Dashboard
1. Go to your service dashboard
2. Click **Manual Deploy** → **Deploy Latest Commit**

## 🛠️ Post-Deployment Verification

Once deployed, verify your setup:

### 1. Check Domain Resolution
```bash
# Test domain resolution
nslookup rosecitydev.tech

# Test HTTPS connectivity  
curl -I https://rosecitydev.tech
```

### 2. Verify SSL Certificate
- Visit https://rosecitydev.tech
- Check for valid SSL certificate (should show secure padlock)
- No certificate warnings

### 3. Test API Connectivity
- Frontend should load properly
- Admin features should work (if enabled)
- GitHub integration should function
- Database connectivity confirmed

## 📊 Monitoring Your Custom Domain

### Render Dashboard Monitoring:
- **Service Logs**: Monitor deployment and runtime logs
- **Metrics**: Track response times and uptime
- **Custom Domain Status**: Verify SSL certificate status

### External Monitoring:
- **SSL Labs**: Test SSL configuration at ssllabs.com
- **PageSpeed Insights**: Monitor performance
- **Uptime Monitoring**: Consider services like Pingdom or UptimeRobot

## 💰 Cost Breakdown

**Render Starter Plan**: $7/month
- Custom domains included
- SSL certificates included
- Better performance
- 24/7 support

**Domain Cost**: (Your existing cost)
- Varies by registrar
- Typically $10-20/year

## 🔧 Troubleshooting

### Domain Not Loading?
1. **Check DNS propagation**: Use dns-checker.org
2. **Verify Render configuration**: Ensure domain is added correctly
3. **Check SSL status**: May take a few minutes to provision

### SSL Certificate Issues?
1. **Wait for provisioning**: Can take 10-15 minutes
2. **Check DNS settings**: Ensure proper A/CNAME records
3. **Contact Render support**: If issues persist

### API Connection Issues?
1. **Check backend service**: Ensure it's running properly
2. **Verify CORS settings**: Backend should allow your custom domain
3. **Environment variables**: Confirm all settings are correct

## 🚀 Next Steps After Domain is Live

1. **Update Social Links**: Update GitHub, LinkedIn, etc. with new URL
2. **SEO Configuration**: Submit to Google Search Console
3. **Analytics Setup**: Configure Google Analytics if desired
4. **Monitoring**: Set up uptime monitoring
5. **Performance**: Consider CDN optimization

## 📞 Support Resources

- **Render Documentation**: https://render.com/docs/custom-domains
- **Render Support**: support@render.com
- **Community Discord**: https://discord.gg/render

---

## 🎯 Action Items Summary

- [ ] Upgrade Render plan to Starter ($7/month)
- [ ] Add custom domain in Render dashboard
- [ ] Configure DNS records at your domain registrar
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Deploy updated configuration
- [ ] Verify domain is working with HTTPS
- [ ] Test all functionality on new domain

**Once complete, your portfolio will be live at: https://rosecitydev.tech** 🎉