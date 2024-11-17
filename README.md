# Svelte Supabase Stripe Starter

A modern full-stack starter template combining Svelte, Supabase, and Stripe for rapid web application development. This template provides authentication, payment processing, and a responsive UI out of the box. Based on 

## Features

- ⚡ **Svelte & SvelteKit** - Reactive UI framework with built-in routing
- 🗄️ **Supabase Integration** - Authentication and real-time database
- 💳 **Stripe Integration** - Payment processing setup
- 🎨 **TailwindCSS** - Utility-first styling
- 🔒 **Auth Flows** - Pre-built sign-in, sign-up, and password reset
- 📱 **Responsive Design** - Mobile-friendly interface

## Architecture
![Project Architecture](./static/architecture_diagram.png)



## Setup Instructions

### Clone Repository

Clone the repository and change into the new directory:
```bash
git https://github.com/gSUz92nc/Svelte-Supabase-Stripe-Starter
cd Svelte-Supabase-Stripe-Starter
```

### Install dependencies:

Next install all the required packages using npm or whatever package manager you'd like to use.

```bash
npm install
```

### Create .env.local

Copy everything from the .env.template to a .env.local file. Don't worry about populating it yet.

```bash
cp .env.template .env.local
```

### Setup Supabase

Create a new Supabase Project at [database.new](https://database.new) which should open to something like this:

![Supabase Project Creation](./static/databasenew.png)

Just fill in all the necessary info and don't worry about any additional settings. After filling in the information hit "Create new project" and wait for the setup to complete which is indicated by the spinner next to your project name

![Spinner for project creation](./static/databasesetup.png)

After it has been setup you should see something like this:

![Supabase successful project creation](./static/databasecreated.png)

Now that your project is setup we need to add our Supabase API keys to our .env.local.  

On the left of the supabase dashboard there is a "Project API" button which will open a drawer with your project keys. 

*Make sure to select the "Connect" tab on the left*

![Supabase keys demonstration](./static/supabasekeys.png)

Now copy the keys using the "Copy" button and then replace the placeholder values in your .env.local file.

- PUBLIC_SUPABASE_URL -> Project URL
- PUBLIC_SUPABASE_ANON_KEY -> Client API key
- SUPABASE_SERVICE_ROLE_KEY -> Service key

*Note: Supabase has recently announced that they plan to change the current api key system. [Click here for info.](https://github.com/orgs/supabase/discussions/29260)*

Your .env.local file should look like this:

![Supabase keys example .env implementation](./static/supabasekeysexample.png)

Next we need to setup our database schema since Supabase uses PostgreSQL which is a relational database. All you have to do is copy everything in '/setup/supabase-schema.sql' into the sql editor on the supabase dashboard (found on the right navbar) and press "Run"

![Schema setup example](./static/schemasetup.png)

It will come up with a warning saying the "Query has destructive operation". Acknowledge this and hit "Run this query"

![Dangerous query example](./static/dangerousquery.png)

It should say "Success. No rows returned" at the bottom.

![Schema success example](./static/schemasucccess.png)

If you now go to the table editor using the left navbar you should see your 5 tables from the schema and if you click on any of them they should have all their columns setup as well as [Row-Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) which is what we use to limit what data users can access from each table.

### Setup Stripe

Create a Stripe account at [https://stripe.com](https://stripe.com)

Once you have verified your email click on "Explore features" then click the "x" at the top left 

![Stripe Verified Email](./static/stripeemail.png)
![Stripe Ignore Features](./static/stripeignorefeatures.png)

You should now be greeted by your Stripe dashboard:

![Stripe Dashboard Example](./static/stripedashboard.png)

Next we want to get our Stripe keys, you may find them on the dashboard as "Publishable key" and "Secret key". If you don't press "CTRL + K" or click on the search bar at the top, type "key" and click on "Developers > API keys"

![Stripe Search](./static/stripesearch.png)

Now all that's left is to copy the keys into your .env.local file

- STRIPE_SECRET_KEY -> Secret key
- PUBLIC_STRIPE_PUBLISHABLE_KEY -> Publishable key

*Leave the STRIPE_WEBHOOK_SECRET for now*

### Getting a URL

After setting up your Stripe account we need to get a public URL for our website, this is so Stripe has somewhere to send their webhooks when creating products on Stripe so our database is synced up with Stripe.

There are a few platforms that support SvelteKit and a few are listed below with tutorials of how to setup a project with their platform

- [Cloudflare](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-site/) (Personally recommend and is what I use)
- [Vercel](https://vercel.com/docs/frameworks/sveltekit)
- [Netlify](https://docs.netlify.com/frameworks/sveltekit/)

*All platforms offer a free tier to get started*

Your build will probably **NOT** build right away since we are still missing the "PUBLIC_SITE_URL" and "STRIPE_WEBHOOK_SECRET". For now just put in a placeholder string so our build can complete and we get a URL.

Hopefully after doing this you will get a public site URL which we will use for setting up Stripe webhooks. Make a note of what the url is. In my case it would be "https://svelte-starter-572.pages.dev"

![alt text](image.png)

*Make sure not to copy your deployment url which may only point to that specific deployment and not future ones. It generally has a code infront of the actual site URL*

You can now update your .env.local with your new site URL and update your environment variable on your hosting service.

- PUBLIC_SITE_URL -> "Your site URL"

### Setting Up Auth Emails

To actually get authentication emails setup we need to update the links in the email templates. First navigate to the email templates section on the Supabase dashboard.

![Example of Supabase Email Template Navigation](./static/emailtemplates.png)

Once there all you need to do is copy these templates into their respective sections.

#### Confirm signup
```html
<h2>Confirm your signup</h2>

<p>Welcome! Please click the button below to confirm your account:</p>

<a href="{{ .SiteURL }}/auth/confirm-signup?confirmation_url={{ urlquery .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup">
    Confirm your account
</a>

<p>If you didn't create this account, you can safely ignore this email.</p>
```

#### Reset Password

```html
<h2>Reset Your Password</h2>

<p>Click the button below to reset your password:</p>

<a href="{{ .SiteURL }}/auth/confirm-reset?confirmation_url={{ urlquery .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}">
    Reset Password
</a>

<p>If you didn't request a password reset, you can safely ignore this email.</p>
```

*You can change the text in each of these emails just make sure that the anchor tag's href is unchanged*

#### Adding your Site URL

Finally using the left navbar click on "URL Configuration" and then enter your site URL you got earlier. Make sure there is no trailing "/" so your site URL looks like: "https://example.com" not "https://example.com/"

### Stripe Webhooks

To set up the webhooks go back to your Stripe dashboard and press "CTRL + K" or click the search bar and type in "event destination" and click on "Create an event destination"

![Stripe Event Destination Example](./static/stripeevent.png)

This will open the workbench where we will enter all the events we want to broadcast to our webhooks endpoint.

*You may also want to update the apiVersion and appInfo in ./src/lib/utils/stripe/config.ts with the current api version and your app info*

Next select of these events by searching for them:

- product.created
- product.updated
- product.deleted
- price.created
- price.updated
- price.deleted
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted

which should look like this:

![Stripe Selected Events](./static/selectedevents.png)

Then press continue. Select the "Webhook endpoint" destination type and then press continue again. Now type in your site URL into the "Endpoint URL" input and then at the end add "/api/webhooks" so that your Endpoint URL is in the format: "https://example.com/api/webhooks". Mine would look like:

![Stripe Endpoint URL Examlple](./static/endpointexample.png)

Then press "Create Endpoint" which should open your event destination in the workbench. Copy your "Signing secret" from the right hand side and paste that into your .env.local file under "STRIPE_WEBHOOK_SECRET" as well as update the environment variable on your hosting platform.

![Stripe Event Destination Secret](./static/eventdestination.png)

- STRIPE_WEBHOOK_SECRET -> Signing Secret

Now rebuild your website after updating the variables and then once it has finished and succeeded your project should be fully set up.

### Create a Subscription

This template only supports subscriptions so let's go over how to create one.

Go to your Stripe dashboard and the on the left click "Product catalogue", then "Create product"

![Product Create Example 1](./static/productcreate1.png)

Next full in the data making sure that it is a "recurring" product and then click "Add product". Then go back to your Supabase project and make sure that it did get added.

![Product Create Example 2](./static/createproduct2.png)
![Product In Supabase Project](./static/product.png)

and if you go to your site, create an account and then go to '/products' you should see 





## Credits
This project is heavily inspired by the [Next.js Subscription Starter](https://github.com/vercel/nextjs-subscription-payments) by Vercel, which I only found out about because of [this](https://www.youtube.com/watch?v=I7CFD99sp1g) video by Supabase.

## Things to do

- Change project id in `package.json`
- Update Site URL on supabase
- Add redirect URL '/auth/update-password' on supabase
- Possibly cascade delete on supabase
- Update Auth templates: Go to the Auth templates page in your dashboard. In the Confirm signup template, change {{ .ConfirmationURL }} to {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email.
- Outlook safelinks messes up auth links. ¯\_(ツ)_/¯