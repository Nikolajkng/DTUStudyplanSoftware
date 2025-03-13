import Head from 'next/head';

export default function MyStudyPlan() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DTU Software Technology</title>
        <link rel="icon" type="image/x-icon" href="assets/icons/favicon-32x32.png" />
        <link rel="stylesheet" href="css/styles.css" />
        <script src="https://cdn.tailwindcss.com" />
      </Head>

      <div className="flex flex-col min-h-screen">

        {/* Main Body Content */}
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold">Welcome to DTU Software Technology</h1>
              <p className="text-lg">
                This is a simple website to show how to deploy a website using GitHub Pages
              </p>
            </div>
          </div>
        </div>


        {/* Footer (edit it in footer.js file!) */}
        <div id="footer"></div>
        <script src="js/footer.js" />
      </div>
    </>
  );
};

