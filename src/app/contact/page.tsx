import Head from 'next/head';

export default function MyStudyPlan() {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>DTU Software Technology</title>
                <link rel="icon" type="image/x-icon" href="/assets/icons/favicon-32x32.png" />
                <link rel="stylesheet" href="/css/startpage.css" />
                <script src="https://cdn.tailwindcss.com" />
            </Head>

            <div className="flex flex-col min-h-screen">
                
                {/* Main Body Content */}
                <div className="max-w-3xl mx-auto bg-gray-50 shadow-lg rounded-lg p-6 flex space-x-6 mt-20">
                    <img
                        src="/assets/images/carstenwitt.png"
                        alt="Carsten Witt"
                        className="w-32 h-40 object-cover rounded-lg border border-gray-300"
                    />

                    {/* Contact Details */}
                    <div>
                        <h2 className="text-xl font-bold">Carsten Witt</h2>
                        <p className="text-gray-600">Professor</p>
                        <p className="text-red-700 font-bold">
                            DTU COMPUTE
                            <br />
                            Department of Applied Mathematics and Computer Science
                            <br />
                            <br />
                        </p>

                        <p className="font-bold">Kontor</p>
                        <p>
                            Danmarks Tekniske Universitet
                            <br />
                            Richard Petersens Plads
                            <br />
                            Building 322, Room 012
                            <br />
                            2800 Kgs. Lyngby
                            <br />
                            <br />
                        </p>

                        <p className="mt-2">
                            <span className="font-bold">Phone:</span>{' '}
                            <a href="tel:+4545253722" className="text-blue-600 hover:underline">
                                +45 4525 3722
                            </a>
                        </p>
                        <p>
                            <span className="font-bold">Email:</span>{' '}
                            <a href="mailto:cawi@dtu.dk" className="text-blue-600 hover:underline">
                                cawi@dtu.dk
                            </a>
                        </p>
                        <p>
                            <span className="font-bold">ORCID:</span>{' '}
                            <a
                                href="https://orcid.org/0000-0002-6105-7700"
                                target="_blank"
                                className="text-blue-600 hover:underline"
                            >
                                0000-0002-6105-7700
                            </a>
                        </p>
                        <p>
                            <span className="font-bold">vCard:</span>{' '}
                            <a href="/assets/documents/CarstenWitt.vcf" className="text-blue-600 hover:underline">
                                vCard
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer (edit it in footer.js file!) */}
            <div id="footer"></div>
            <script src="/js/footer.js" />
        </>
    );
};
