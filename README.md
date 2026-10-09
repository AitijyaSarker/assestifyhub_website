# Rise & Shine Digital

https://www.facebook.com/profile.php?id=61583933039295
here is my company , I have added my company facebook page, to get the detials 
and here is a website from which you will extract the features I need in my website : https://riseuplabs.com/  
so design a website which will be minimal,prffessional , eye ceatcy animation and hover, and a broader look based on my logo and company theme

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3093afe9-9454-43d2-8668-352bab6aa871).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
bun install
bun run dev
```

Run the API in a second terminal:

```sh
cd server
bun run dev
```

The API reads its MongoDB and admin credentials from `server/.env`. Authenticated admin CMS changes are stored in the `cms_snapshots` collection and loaded by the public site; public reads expose only published content. If MongoDB is unavailable, the admin reports that publishing failed and retains the local browser copy. Public enquiries continue to open a prefilled email draft.

The admin Products editor manages service categories, uploaded or linked cover images, image galleries, descriptions, technology stacks, reviews, awards, access features, service owners, tags, project links, and publication order. Product detail pages display the corresponding published content. Featured products are prioritized in public project listings, and concept imagery remains labeled as illustrative.
