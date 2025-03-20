import Image from 'next/image';

export default function MyStudyPlan() {
    return (
        <>
            <div className="flex flex-col min-h-screen">

                {/* Main Body Content */}
                <div className="max-w-3xl mx-auto bg-gray-50 shadow-lg rounded-lg p-6 flex space-x-6 mt-20">
                    <Image
                        src="/assets/images/carstenwitt.png"
                        alt="Carsten Witt"
                        width={128} // Specify width
                        height={160} // Specify height
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
        </>
    );
};
