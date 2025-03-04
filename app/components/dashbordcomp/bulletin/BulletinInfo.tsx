"use client";
import React from "react";

export interface BulletinInfoProps {
  selectedStudent: {
    displayName: string;
    sexe: string;
    neEA: string;
    naissance: string;
    classe: string;
    section: string;
    numPerm: string;
  };
  schoolInfo: {
    province: string;
    ville: string;
    commune: string;
    nom: string;
    code: string;
  };
}

// Fonction pour formater une date au format "jj/mm/aaaa"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const BulletinInfo: React.FC<BulletinInfoProps> = ({ selectedStudent, schoolInfo }) => {
  return (
    <div className="border p-4 mx-auto uppercase">
      {/* Identification */}
      <div className="mb-4 items-center">
        <label className="font-bold pl-24 pr-2">N° ID.</label>
        {Array(27)
          .fill("")
          .map((_, i) => (
            <span key={i} className="border border-black inline-block w-6 h-6"></span>
          ))}
      </div>
      {/* Informations sur l'école */}
      <div className="border-t border-black py-2">
        <p className="font-bold">
          Province: {schoolInfo?.province || "Province de l'école"}
        </p>
      </div>
      {/* Infos élève et école */}
      <div className="grid grid-cols-2 border-t border-black py-2">
        <div>
          <p>
            <span className="font-bold">VILLE :</span>{" "}
            {schoolInfo?.ville || "Ville"}
          </p>
          <p>
            <span className="font-bold">COMMUNE :</span>{" "}
            {schoolInfo?.commune || "Commune"}
          </p>
          <p>
            <span className="font-bold">ECOLE :</span>{" "}
            {schoolInfo?.nom || "Nom de l'école"}
          </p>
          <p>
            <span className="font-bold">CODE :</span>{" "}
            {schoolInfo?.code || "Code"}
          </p>
        </div>
        <div>
          <p className="font-bold uppercase">
            <span className="font-medium">ELEVE :</span> {selectedStudent.displayName}{" "}
            <span className="font-medium pl-10">SEXE :</span> {selectedStudent.sexe}
          </p>
          <p className="font-bold uppercase">
            <span className="font-medium">NE (E) A :</span> {selectedStudent.neEA}{" "}
            <span className="font-medium pl-10">LE :</span>{" "}
            {formatDate(selectedStudent.naissance)}
          </p>
          <p className="font-bold">
            <span className="font-medium">CLASSE :</span> {selectedStudent.classe}
          </p>
          <p className="font-bold">
            <span className="font-medium pr-2">N° PERM :</span> {selectedStudent.numPerm}
          </p>
        </div>
      </div>
      {/* Titre du bulletin */}
      <div className="border-t border-black text-center py-2 font-bold">
        <p>
          BULLETIN DE LA {selectedStudent.classe} ANNÉE {selectedStudent.section} ANNÉE SCOLAIRE 20......-20........
        </p>
      </div>
    </div>
  );
};

export default BulletinInfo;
