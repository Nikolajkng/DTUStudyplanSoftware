export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">DTU Softwareteknologi Studieplanlægger</h1>
        </div>

        {/* About Section */}
        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="text-2xl font-semibold mb-4">Om Softwareteknologi Studieforløbs planlægger</h2>
          <p className="text-gray-700">
            Velkommen til hjemmesiden for studerende på DTUs bacheloruddannelse i softwareteknologi.
            På hjemmesiden kan du finde konkrete oplysninger om studiet som er særligt relevant for software-studerende.
            <br /><br />
            Derudover har du også mulighed for at se eksempler på anbefalede studieforløb.
            Du kan også planlægge dit eget studieforløb med udgangspunkt i de anbefalede studieforløb.
            <br /><br />
            Generel orientering om bachelorstudiet og studielinjen kan findes på DTUs uddannelsesside og i studieordningen for Softwareteknologi.
            <br /><br />
            God fornøjelse.
          </p>
        </section>

        {/* News Section */}
        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="text-2xl font-semibold mb-4">Sidste nyt</h2>
          <div className="space-y-6">
            {[
              { date: 'Februar 7, 2025', title: 'Ny studieforløb hjemmeside', content: 'Den tidligere hjemmeside for studieforløb for softwareteknologi er blevet opdateret og erstattet af denne hjemmeside.', link: 'https://www2.compute.dtu.dk/softwareteknologi/index.html' },
              { date: 'November 30, 2023', title: 'Tilpasset kursusnummer for Projektledelse', content: 'Udbydes som 3-ugers kursus i januar og august og tages fortrinsvist sent i studiet.' },
              { date: 'July 28, 2023', title: 'Tilpasset siden til det nye polytekniske grundlag', content: 'Opdatering af siden og eksemplariske studieforløb tilpasset regler for studerende fra 2023.' },
              { date: 'December 19, 2022', title: 'Kurset 42610 udgår', content: 'Kurset 42610 (Ingeniørfagets Videnskabsteori) afholdes sidste gang i foråret 2023. Fremover henvises til 42611.' },
              { date: 'May 17, 2022', title: 'Kursus 27008 udgår', content: 'Kursus 27008 (Life Science) udgår som forårsversion. Efterårsversion 27002 udbydes stadigvæk.' },
              { date: 'April 27, 2022', title: 'Info om kursusvalg i 3-ugers perioderne', content: 'Opdatering om kursusvalg for årgang 2021 og 2020 i juni/august 2022.' },
              { date: 'August 23, 2021', title: 'Tilføjet eksemplarisk studieforløb', content: 'Nyt eksempel på studieforløb for Computer Engineering.' },
              { date: 'June 18, 2021', title: 'Opdatering af kursusliste', content: 'Kurset 02159 (Operativsystemer) har ændret skemamodul til E2B.' },
            ].map((news, index) => (
              <div key={index} className="border-b pb-4">
                <p className="text-sm text-gray-500">{news.date}</p>
                <h3 className="text-lg font-semibold">{news.title}</h3>
                <div className="text-gray-700">
                  <p>{news.content}</p>
                  {news.link && (
                    <p>
                      <a href={news.link} className="text-blue-600 hover:underline">Læs mere</a>
                    </p>
                  )}
                </div>

              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
