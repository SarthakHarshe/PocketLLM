import os
from pypdf import PdfReader

def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error reading {pdf_path}: {str(e)}"

# Files in SA Project directory
sa_project_files = [
    "Kasyap_Sai_Chakkirala_CSCI578_Assignment2.pdf",
    "Kasyap_Sai_Chakkirala_CSCI578_Assignment3.pdf"
]

output_dir = "extracted_texts"
os.makedirs(output_dir, exist_ok=True)

# Process SA Project files
for pdf_file in sa_project_files:
    path = os.path.join("SA Project", pdf_file)
    if os.path.exists(path):
        print(f"Extracting {path}...")
        text = extract_text_from_pdf(path)
        output_filename = os.path.join(output_dir, pdf_file + ".txt")
        with open(output_filename, "w") as f:
            f.write(text)
        print(f"Saved to {output_filename}")
    else:
        print(f"File not found: {path}")
