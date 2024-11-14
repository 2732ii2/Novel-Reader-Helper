import * as pdfjsLib from 'pdfjs-dist';

const handleFileChange = (event,setTextContent) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        console.log('PDF file content as ArrayBuffer:', arrayBuffer);

        try {
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          // console.log(pdf);
          let textContent = '';
          var l=[];
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
              l.push(content);
          }
          setTextContent(l);
        } catch (error) {
          console.error('Error extracting text from PDF:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

export default handleFileChange;