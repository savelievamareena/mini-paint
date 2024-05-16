import { DocumentData } from "firebase/firestore";

export function retrieveEmailsFromPicData(picsData) {
    const emails: string[] = [];
    picsData.forEach((picData: DocumentData) => {
        if (!emails.includes(picData.data.userEmail)) {
            emails.push(picData.data.userEmail);
        }
    });
    return emails;
}
