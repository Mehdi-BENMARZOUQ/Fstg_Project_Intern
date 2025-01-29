import React, { useEffect, useState } from "react";
import axios from "axios";
import Case from "../../components/Case";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEdit,faTrash,faDownload, faCheck,faTimes,faSpinner } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { jsPDF } from "jspdf";
import "../../assets/stisla/css/custom.css"


const MySwal = withReactContent(Swal);
export default function DetailleConvention() {
    const [conventions, setConventions] = useState([]);
    const [selectedConvention, setSelectedConvention] = useState(null); 
    const [showModal, setShowModal] = useState(false); 

    useEffect(() => {
        fetchConventions();
    }, []);


    const fetchConventions = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/conventions");
            setConventions(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des conventions :", error);
        }
    };


     // Ouvrir le modal de modification
    const handleEdit = (convention) => {
        setSelectedConvention(convention); // Définir la convention sélectionnée
        setShowModal(true); // Afficher le modal
    };

    // Fermer le modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedConvention(null);
    };

    // Soumettre le formulaire de modification
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `http://localhost:8000/api/conventions/${selectedConvention.id}`,
                selectedConvention
            );

            // Mettre à jour la liste des conventions
            setConventions(
                conventions.map((convention) =>
                    convention.id === selectedConvention.id ? response.data : convention
                )
            );

            // Fermer le modal
            handleCloseModal();

            // Afficher un message de succès
            MySwal.fire({
                title: "Succès !",
                text: "La convention a été mise à jour avec succès.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la convention :", error);
            MySwal.fire({
                title: "Erreur !",
                text: "Une erreur s'est produite lors de la mise à jour de la convention.",
                icon: "error",
            });
        }
    };

    // Mettre à jour les champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedConvention({
            ...selectedConvention,
            [name]: value,
        });
    };



    // Fonction pour supprimer une convention
    const handleDelete = async (id) => {
        // Boîte de dialogue de confirmation
        const result = await MySwal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous ne pourrez pas annuler cette action !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, supprimer !",
            cancelButtonText: "Annuler",
        });

        // Si l'utilisateur confirme la suppression
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8000/api/conventions/${id}`);
                // Mettre à jour la liste des conventions après suppression
                setConventions(conventions.filter((convention) => convention.id !== id));

                // Boîte de dialogue de succès
                MySwal.fire({
                    title: "Supprimé !",
                    text: "La convention a été supprimée avec succès.",
                    icon: "success",
                    timer: 1500, // Fermer automatiquement après 1,5 seconde
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error("Erreur lors de la suppression de la convention :", error);

                // Boîte de dialogue d'erreur
                MySwal.fire({
                    title: "Erreur !",
                    text: "Une erreur s'est produite lors de la suppression de la convention.",
                    icon: "error",
                });
            }
        }
    };

    const handleConfirm = async (convention) => {
        const result = await MySwal.fire({
            title: "Êtes-vous sûr ?",
            text: "Après confirmation, vous ne pourrez plus modifier ou supprimer cette convention.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, confirmer !",
            cancelButtonText: "Annuler",
        });

        if (result.isConfirmed) {
            setSelectedConvention({
                ...convention,
                is_telecharger: true,
            });

            // Call handleUpdate to update the convention
            await handleUpdate({
                preventDefault: () => {},
            });
        }
    };


    const handleDownload = (convention) => {
        const doc = new jsPDF();

        // Page 1
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("CONVENTION DE STAGE", 105, 10, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Entre :", 10, 20);
        doc.text("- d’une part :", 10, 30);
        doc.text("La Faculté des Sciences et Techniques de Marrakech, représentée par son Doyen Monsieur SAID RAKRAK", 10, 40);
        doc.text("Adresse : BP 524, AV. Abdelkrim El Khattabi, Guéliz, Marrakech, Maroc.", 10, 50);
        doc.text("Téléphone : +212 524 43 34 04", 10, 60);
        doc.text("Fax : +212 524 43 31 70", 10, 70);
        doc.text("Et désignée ci-après par Etablissement de formation.", 10, 80);

        doc.text("- Et d’autre part :", 10, 90);
        doc.text(`Nom : ${convention.entreprise_nom}`, 10, 100);
        doc.text(`Adresse : ${convention.entreprise_adresse}`, 10, 110);
        doc.text(`Téléphone : ${convention.entreprise_telephone}`, 10, 120);
        doc.text(`Fax : ${convention.entreprise_fax}`, 10, 130);
        doc.text(`Représenté par : ${convention.entreprise_representant}`, 10, 140);
        doc.text("Et désigné ci-après par l’entreprise.", 10, 150);

        doc.text("Elle concerne :", 10, 160);
        doc.text(`Etudiant/Etudiante : ${convention.stagiaire_nom}`, 10, 170);
        doc.text(`Etudiant(e) régulièrement inscrit(e) dans l’établissement pour l’année universitaire 20...../20.....`, 10, 180);
        doc.text(`Et dont la carte d’étudiant porte le numéro du Code Masar suivant : ${convention.stagiaire_code_masar}`, 10, 190);
        doc.text("Et dénommé ci-après le stagiaire.", 10, 200);

        // Article 1
        doc.setFont("helvetica", "bold");
        doc.text("Article 1 :", 10, 210);
        doc.setFont("helvetica", "normal");
        doc.text("La présente convention régit les rapports des deux parties, dans le cadre de l’organisation de stage d’entreprise conformément aux conditions fixées à la présente convention.", 10, 220);

        // Article 2
        doc.setFont("helvetica", "bold");
        doc.text("Article 2 :", 10, 230);
        doc.setFont("helvetica", "normal");
        doc.text("Le programme du stage est élaboré par le personnel chargé de l’encadrement du stagiaire, en tenant compte du programme et de spécialité des études du stagiaire, ainsi que des moyens humain et matériel de l’entreprise. Cette dernière se réserve le droit de réorienter l’apprentissage en fonction des qualifications du stagiaire et du rythme de ses activités professionnelles.", 10, 240);

        // Article 3
        doc.setFont("helvetica", "bold");
        doc.text("Article 3 :", 10, 250);
        doc.setFont("helvetica", "normal");
        doc.text("Pendant le stage, le stagiaire est soumis aux usages et règlements de l’entreprise, notamment en matière de discipline et des horaires. En cas de manquement à ces règles, l’entreprise se réserve le droit de mettre fin au stage, après avoir prévenu l’établissement de formation.", 10, 260);

        // Article 4
        doc.setFont("helvetica", "bold");
        doc.text("Article 4 :", 10, 270);
        doc.setFont("helvetica", "normal");
        doc.text("Au terme de son stage, le stagiaire remettra un rapport de stage à l’entreprise si réclamé par celle-ci.", 10, 280);

        // Ajouter une nouvelle page
        doc.addPage();

        // Page 2
        doc.setFont("helvetica", "bold");
        doc.text("Article 5 :", 10, 10);
        doc.setFont("helvetica", "normal");
        doc.text("Le stagiaire s’engage à garder confidentielle toute information recueillie dans l’entreprise, et à n’utiliser en aucun cas ces informations pour faire l’objet d’une publication, communication à des tiers, conférences, sans l’accord préalable de l’entreprise.", 10, 20);

        // Article 6
        doc.setFont("helvetica", "bold");
        doc.text("Article 6 :", 10, 30);
        doc.setFont("helvetica", "normal");
        doc.text("Le stagiaire est tenu de souscrire une assurance pour la garantir contre les risques d’accident ou d’incident auxquels le stagiaire pourrait être exposé durant la période de son stage.", 10, 40);

        // Article 7
        doc.setFont("helvetica", "bold");
        doc.text("Article 7 :", 10, 50);
        doc.setFont("helvetica", "normal");
        doc.text("En cas de non-respect de l’une des clauses de cette convention aussi bien par le stagiaire, l’entreprise se réserve le droit de mettre fin à ce stage.", 10, 60);

        // Article 8
        doc.setFont("helvetica", "bold");
        doc.text("Article 8 :", 10, 70);
        doc.setFont("helvetica", "normal");
        doc.text(`Le stage se déroulera du ${convention.date_debut} au ${convention.date_fin}`, 10, 80);

        // Signatures
        doc.text("Pour l’entreprise :", 10, 100);
        doc.text("Pour l’établissement :", 10, 110);
        doc.text("………, le …/…/………", 10, 120);
        doc.text("Lu et approuvé", 10, 130);

        doc.text("Le stagiaire :", 10, 140);
        doc.text("Marrakech, le …/…/………", 10, 150);

        doc.text("Le responsable de la filière :", 10, 160);
        doc.text("Marrakech, le …/…/………", 10, 170);

        doc.text("Le Doyen :", 10, 180);
        doc.text("Marrakech, le …/…/………", 10, 190);

        // Télécharger le PDF
        doc.save(`CONVENTION_DE_STAGE_${convention.id}.pdf`);
    };

    return (
        <Case>
            <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                <h1 className="mb-1 tw-text-lg">État de votre convention de stage</h1>
            </div>

            <div className="section-body">
                <div className="card">
                    <div className="card-body px-0">
                        <p className="px-4">
                            Vous pouvez maintenant consulter l'état de votre convention de stage après avoir complété le formulaire. <br/>
                            Vous pourrez suivre son avancement dans la section ÉTAT. <br/>
                            <span style={{color:"red"}}>NB: Une fois confirmée, elle ne pourra plus être modifiée ou supprimée.</span>
                        </p>

                        <div className="table-responsive px-4">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Entreprise</th>
                                        <th>Stagiaire</th>
                                        <th>Date de début</th>
                                        <th>Date de fin</th>
                                        <th>Etat</th>
                                        <th>
                                            <i className="fas fa-cog"></i>
                                        </th>
                                        <th>Confirmer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conventions.map((convention) => (
                                        <tr key={convention.id}>
                                            <td>{convention.entreprise_nom}</td>
                                            <td>{convention.stagiaire_nom}</td>
                                            <td>{convention.date_debut}</td>
                                            <td>{convention.date_fin}</td>
                                            <td>
                                                <div className="d-flex flex-column flex-md-row justify-content-between">
                                                    <div className="mx-1 my-1 my-md-0">
                                                        {convention.is_telecharger ? (
                                                            <div className="badge badge-success" title="Votre convention de stage a été confirmée">
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </div>
                                                        ) : (
                                                            <div className="badge badge-danger" title="Votre convention de stage n'a pas encore été confirmée">
                                                                <FontAwesomeIcon icon={faTimes} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mx-1 my-1 my-md-0">
                                                        {convention.is_valider ? (
                                                            <div className="badge badge-success" title="Votre convention de stage a été validée par le service de communication.">
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </div>
                                                        ) : (
                                                            <div style={{background:"#d9713f",color:"white"}} className="badge  " title=" Votre convention de stage est actuellement en cours de traitement au sein du service de communication.">
                                                                <FontAwesomeIcon icon={faSpinner} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mx-1 my-1 my-md-0">
                                                        {convention.is_signer ? (
                                                            <div className="badge badge-success" title="Votre convention de stage a reçu l'approbation du secrétaire général.">
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </div>
                                                        ) : (
                                                            <div style={{background:"#d9713f",color:"white"}} className="badge " title="Votre convention de stage est actuellement en cours d'examen au sein du cabinet du secrétaire général.">
                                                                <FontAwesomeIcon icon={faSpinner} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td >
                                                <div className="d-flex flex-column flex-md-row">
                                                    <button
                                                        className="btn btn-sm btn-warning mx-1 my-1 my-md-0"
                                                        onClick={() => handleEdit(convention)}
                                                        title="Modifier"
                                                        disabled={convention.is_telecharger}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger mx-1 my-1 my-md-0"
                                                        onClick={() => handleDelete(convention.id)}
                                                        title="Supprimer"
                                                        disabled={convention.is_telecharger}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-success mx-1 my-1 my-md-0"
                                                        onClick={() => handleDownload(convention)}
                                                        title="Télécharger"
                                                    >
                                                        <FontAwesomeIcon icon={faDownload} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{textAlign:"center"}}>
                                                {!convention.is_telecharger &&
                                                <button
                                                    className="btn btn-sm btn-success mx-1"
                                                    onClick={() => handleConfirm(convention)}
                                                    title="Confirmer"

                                                >
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>








                            {showModal && selectedConvention && (
                                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                                    <div className="modal-dialog modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Modifier la convention</h5>
                                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={handleUpdate}>
                                                    {/* Nom de l'entreprise */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Nom de l'entreprise</label>
                                                        <input
                                                            type="text"
                                                            name="entreprise_nom"
                                                            value={selectedConvention.entreprise_nom}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                    {/* Adresse de l'entreprise */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Adresse de l'entreprise</label>
                                                        <input
                                                            type="text"
                                                            name="entreprise_adresse"
                                                            value={selectedConvention.entreprise_adresse}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-around">

                                                        {/* Téléphone de l'entreprise */}
                                                        <div className="mb-3">
                                                            <label className="form-label">Téléphone de l'entreprise</label>
                                                            <input
                                                                type="text"
                                                                name="entreprise_telephone"
                                                                value={selectedConvention.entreprise_telephone}
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                required
                                                            />
                                                        </div>

                                                        {/* Fax de l'entreprise */}
                                                        <div className="mb-3">
                                                            <label className="form-label">Fax de l'entreprise</label>
                                                            <input
                                                                type="text"
                                                                name="entreprise_fax"
                                                                value={selectedConvention.entreprise_fax}
                                                                onChange={handleChange}
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>




                                                    {/* Représentant de l'entreprise */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Représentant de l'entreprise</label>
                                                        <input
                                                            type="text"
                                                            name="entreprise_representant"
                                                            value={selectedConvention.entreprise_representant}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Nom du stagiaire */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Nom du stagiaire</label>
                                                        <input
                                                            type="text"
                                                            name="stagiaire_nom"
                                                            value={selectedConvention.stagiaire_nom}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Code Masar du stagiaire */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Code Masar du stagiaire</label>
                                                        <input
                                                            type="text"
                                                            name="stagiaire_code_masar"
                                                            value={selectedConvention.stagiaire_code_masar}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Date de début */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Date de début</label>
                                                        <input
                                                            type="date"
                                                            name="date_debut"
                                                            value={selectedConvention.date_debut}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Date de fin */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Date de fin</label>
                                                        <input
                                                            type="date"
                                                            name="date_fin"
                                                            value={selectedConvention.date_fin}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Boutons du modal */}
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" style={{color:"gray"}} onClick={handleCloseModal}>
                                                            Fermer
                                                        </button>
                                                        <button type="submit" className="btn btn-primary" style={{color:"#d9713f"}}>
                                                            Enregistrer les modifications
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </Case>
    );
}