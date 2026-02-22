from typing import Optional
from pathlib import Path

from pypdf import PdfReader
from docx import Document


def parse_txt(file_path: Path) -> str:
    return file_path.read_text(encoding="utf-8", errors="ignore")


def parse_pdf(file_path: Path) -> str:
    reader = PdfReader(str(file_path))
    text = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text.append(page_text)
    return "\n".join(text)


def parse_docx(file_path: Path) -> str:
    doc = Document(str(file_path))
    return "\n".join(p.text for p in doc.paragraphs if p.text)


def extract_text(file_path: Path) -> Optional[str]:
    suffix = file_path.suffix.lower()

    if suffix == ".txt":
        return parse_txt(file_path)
    elif suffix == ".pdf":
        return parse_pdf(file_path)
    elif suffix == ".docx":
        return parse_docx(file_path)
    else:
        return None