import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import appConfig from "../../config/appConfig";
import Pagination from "../Layout/Components/Pagination";
import SearchEntries from "../Layout/Components/SearchEntries";
import Case from "../../components/Case";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ConfirmationDesConvention() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showing, setShowing] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedConvention, setSelectedConvention] = useState(null);



    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        const filteredData = rows.filter(row =>
            row.stagiaire_nom.toLowerCase().includes(value) ||
            row.entreprise_nom.toLowerCase().includes(value) ||
            row.date_debut.toLowerCase().includes(value) ||
            row.date_fin.toLowerCase().includes(value)
        );
        setFilteredRows(filteredData);
    };

    const handleShow = (event) => {
        setShowing(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (convention) => {
        setSelectedConvention(convention);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedConvention(null);
    };


    const handleConfirm = (convention) => {
        MySwal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous êtes sur le point de confirmer cette convention.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, confirmer!'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedConvention = { ...convention, is_valider: 1 };
                axios
                    .put(`${appConfig.baseurlAPI}/conventions/${convention.id}`, updatedConvention)
                    .then((response) => {
                        setRows((prevRows) =>
                            prevRows.map((row) =>
                                row.id === convention.id ? { ...row, is_valider: 1 } : row
                            )
                        );
                        Swal.fire(
                            'Confirmé!',
                            'La convention a été confirmée.',
                            'success'
                        );
                    })
                    .catch((error) => {
                        console.error("Error updating convention:", error);
                    });
            }
        });
    };

    useEffect(() => {
        document.title = "Confirmation des Conventions";
        setIsLoading(true);
        axios
            .get(
                `${appConfig.baseurlAPI}/conventions`
            )
            .then((response) => {
                if (response.data) {
                    const filteredData = response.data.filter(
                        (convention) => convention.is_telecharger === 1 && convention.is_valider === 0
                    );
                    setRows(filteredData);
                    setFilteredRows(filteredData);
                } else {
                    console.error("Unexpected API response structure:", response);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.response?.status === 403) {
                    navigate("/403");
                } else {
                    console.error("Error fetching conventions:", error);
                }
                setIsLoading(false);
            });
    }, [navigate]);

    const indexOfLastItem = currentPage * showing;
    const indexOfFirstItem = indexOfLastItem - showing;
    const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

    if (isLoading) {
        return (
            <Case>
                <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                    <h1 className="mb-1 tw-text-lg">Loading...</h1>
                </div>
            </Case>
        );
    }

    return (
        <Case>
            <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                <h1 className="mb-1 tw-text-lg">Confirmation des Conventions</h1>
            </div>
            <div className="section-body">
                <div className="card">
                    <div className="card-body px-0">
                        <SearchEntries
                            showing={showing}
                            handleShow={handleShow}
                            searchTerm={searchTerm}
                            handleSearch={handleSearch}
                        />
                        <div className="table-responsive tw-max-h-96">
                            <table>
                                <thead className="tw-sticky tw-top-0">
                                <tr className="tw-text-gray-700">
                                    <th>Stagiaire</th>
                                    <th>Entreprise</th>
                                    <th>Date de début</th>
                                    <th>Date de fin</th>
                                    <th className="text-center">
                                        <i className="fas fa-cog"></i>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(currentItems) && currentItems.length ? (
                                    currentItems.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.stagiaire_nom}</td>
                                            <td>{row.entreprise_nom}</td>
                                            <td>{row.date_debut}</td>
                                            <td>{row.date_fin}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-success mr-2"
                                                    onClick={() => handleConfirm(row)}
                                                >
                                                    <i className="fas fa-check"></i>
                                                </button>
                                               {/* <button
                                                    className="btn btn-danger mr-2"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>*/}
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => handleViewDetails(row)}

                                                >
                                                    <i className="fas fa-book"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >
                                            No conventions available
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            showing={showing}
                            handlePageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>

            {showModal && selectedConvention && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Détails de la convention</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Nom de l'entreprise:</strong> {selectedConvention.entreprise_nom}</p>
                                <p><strong>Adresse de l'entreprise:</strong> {selectedConvention.entreprise_adresse}</p>
                                <p><strong>Téléphone de l'entreprise:</strong> {selectedConvention.entreprise_telephone}</p>
                                <p><strong>Fax de l'entreprise:</strong> {selectedConvention.entreprise_fax}</p>
                                <p><strong>Représentant de l'entreprise:</strong> {selectedConvention.entreprise_representant}</p>
                                <p><strong>Nom du stagiaire:</strong> {selectedConvention.stagiaire_nom}</p>
                                <p><strong>Code Masar du stagiaire:</strong> {selectedConvention.stagiaire_code_masar}</p>
                                <p><strong>Date de début:</strong> {selectedConvention.date_debut}</p>
                                <p><strong>Date de fin:</strong> {selectedConvention.date_fin}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" style={{color:"gray"}} onClick={handleCloseModal}>
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </Case>
    );
}
