import { writeToFile } from "@/lib/file_utils";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
const pdf = require("html-pdf");

interface Case {
  court: string;
  caseNumber: string;
  judge: string;
  defendant: string;
  criminalAct: string;
  articlesCriminalAct: string;
  punishment: string;
  explanation: string;
  fileName: string;
  sanction: string;
}

export async function POST(request: NextRequest) {
  const caseToSave: Case = await request.json();
  const htmlText: string = `
<!DOCTYPE html>
<html>
  <style>
    body.scoped {
      font-size: 0.9rem;
      font-family: Source Sans Pro, sans-serif;
      line-height: 1.5;
      min-height: 100%;
      min-width: 100px;
    }

    a.scoped {
      color: #236693;
      font-weight: 700;
    }

    a.scoped:link {
      background-color: transparent;
      text-decoration: none;
    }

    a.scoped:visited {
      background-color: transparent;
      text-decoration: none;
    }

    a.scoped:hover {
      background-color: transparent;
      text-decoration: underline;
    }

    a.scoped:active {
      background-color: transparent;
      text-decoration: underline;
    }

    .header {
      text-align: center;
    }
  </style>

  <body class="scoped">
    <div style="padding: 20px 0; width: 100%; text-align: center">
      <p style="font-size: 0.8rem; line-height: 1rem; margin: auto">${caseToSave.court}</p>
      <p style="color: #245474; font-size: 2rem; font-weight: 700; line-height: 2rem; margin: auto">
      ${caseToSave.caseNumber}</p>
      <p style="color: #555; font-size: 0.8rem; line-height: 1rem; margin: auto">29. Februar 2024.</p>
    </div>
    <article style="padding: 50px 10% 20px">
      <p style="text-align: right">K. br. 29/10</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>

      <p class="header">U IME CRNE GORE</p>
      <p>&nbsp;</p>

      <p>
        ${caseToSave.court.toUpperCase()}
        kao prvostepeni krivični, sudija ${caseToSave.judge},
        uz učešće Ane Ivanović, kao zapisničara, u krivičnom predmetu
        okrivljenog ${caseToSave.defendant} zbog krivičnog dela
        ${caseToSave.criminalAct} iz <a class="scoped">${caseToSave.articlesCriminalAct} u KZ</a>
      </p>

      <p>&nbsp;</p>
      <p class="header">P R E S U D U</p>
      <p>&nbsp;</p>

      <p>
        Okrivljeni ${caseToSave.defendant}, državljanin Crne Gore.
      </p>

      <p>&nbsp;</p>
      <p class="header">K R I V J E</p>
      <p>&nbsp;</p>
      
      <p>
        ${caseToSave.sanction}
      </p>
        

      <p>&nbsp;</p>
      <p class="header">O S U Đ U J E</p>
      <p>&nbsp;</p>

      <p>Na kaznu ${caseToSave.punishment}</p>

      <p>&nbsp;</p>
      <p style="text-align: center">O B R A Z L O Ž E Nj E</p>
      <p>&nbsp;</p>

      <div style="text-align: justify">
        &nbsp;<br />
        ${caseToSave.explanation}
        <br />
        &nbsp;<br />
        &nbsp;<br />
        &nbsp;&nbsp; ZAPISNIČAR,
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; S U D I J A,<br />
        Ana Ivanović,
        s.r.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${caseToSave.judge}, s.r.<br />
        &nbsp;<br />
        &nbsp;<br />
        PRAVNA POUKA: Protiv ove presude može se izjaviti žalba u roku od 15 dana od dana prijema pismenog otpravka
        Višem sudu u Podgorici, a preko ovog suda.<br />
        <br clear="all" />
        DOSTAVITI:<br />
        - ODT Podgorica<br />
        - Okrivljenom u ZIKS-u<br />
        - Braniocu okrivljenog adv. Đ.D.<br />
        - Po pravosnažnosti oštećenom DOO "M." N.
      </div>
    </article>
  </body>
</html>`;

  writeToFile(path.join("public", "html", "presude", `${caseToSave.fileName}.html`), htmlText);

  console.log("saved file");
  pdf
    .create(htmlText, {
      format: "A4",
      phantomPath: path.resolve(process.cwd(), "node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs"),
      script: path.resolve(process.cwd(), "node_modules/html-pdf/lib/scripts/pdf_a4_portrait.js"),
      childProcessOptions: {
        env: {
          OPENSSL_CONF: "/dev/null",
        },
      },
    })
    .toFile(path.resolve(process.cwd(), `public/pdf/presude/${caseToSave.fileName}.pdf`), (err: any, res: any) => {
      console.log("pdf error:", err);
      console.log("pdf res:", res);
    });

  try {
    return NextResponse.json({ success: "Case saved" });
  } catch (error) {
    return NextResponse.json({ error: "Failed save case" });
  }
}
