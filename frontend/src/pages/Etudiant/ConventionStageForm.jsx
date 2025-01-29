import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Case from "../../components/Case";
import { getTokenWithExpiration} from "../Auth/Session.js";
import {useNavigate} from "react-router-dom";
import appConfig from "../../config/appConfig";
import '../../assets/stisla/css/custom.css'
export default function ConventionStageForm () {
    // Déclaration des états pour l'utilisateur et les données du formulaire
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const token = getTokenWithExpiration("token");
    const [formData, setFormData] = useState({
        entreprise_nom: '',
        entreprise_adresse: '',
        entreprise_telephone: '',
        entreprise_fax: '',
        entreprise_representant: '',
        stagiaire_nom: '',
        stagiaire_code_masar: '',
        date_debut: '',
        date_fin: '',
        user_id: '',
    });

    const [message, setMessage] = useState(({msg:'',color:''}));
    const [shake, setShake] = useState(false);

    // Vérification de l'authentification de l'utilisateur lors du chargement du composant
    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            fetchUserData();
        }
    }, [navigate, token]);
    // Récupération des informations de l'utilisateur
    const fetchUserData = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
            const response = await axios.get(`${appConfig.baseurlAPI}/user`);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    // Mise à jour automatique de l'ID utilisateur dans le formulaire
    useEffect(() => {
        if (user.id) {
            setFormData((prevState) => ({
                ...prevState,
                user_id: user.id,
            }));
        }
    }, []);
    // Gestion des changements dans les champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getTokenWithExpiration("token");
        if (!token) {
            setMessage({msg: 'No token found. Please login again.',color: 'danger'});
            navigate('/');
            return;
        }

        try {
            // Vérification si une convention de stage existe déjà pour l'utilisateur
            const checkResponse = await axios.get(`${appConfig.baseurlAPI}/conventionstage/user/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (checkResponse.data.exists) {
                setMessage({msg:'Vous avez déjà une convention de stage.',color:'danger'});
                setShake(true);
                setTimeout(() => setShake(false), 500);
                return;
            }

            // Envoi des données du formulaire
            const response = await axios.post(`${appConfig.baseurlAPI}/conventionstage`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

                if (response.status === 201) {
                    setMessage({msg:'Convention de stage créée avec succès !', color:'success'});
                    // Réinitialisation du formulaire après la soumission réussie
                    setFormData({
                        entreprise_nom: '',
                        entreprise_adresse: '',
                        entreprise_telephone: '',
                        entreprise_fax: '',
                        entreprise_representant: '',
                        stagiaire_nom: '',
                        stagiaire_code_masar: '',
                        date_debut: '',
                        date_fin: '',
                        user_id: user.id || '',
                    });
                }

        } catch (error) {
            // Gestion des erreurs
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                let errorMessage = 'Erreurs de validation :\n';
                for (const key in errors) {
                    errorMessage += `${key}: ${errors[key].join(', ')}\n`;
                }
                setMessage({msg:errorMessage, color:'danger'});
            } else {
                setMessage({msg:'Erreur lors de la création de la convention de stage.',color: 'danger'});
            }
            setShake(true);
            setTimeout(() => setShake(false), 500);
            console.error(error);
        }
    };

    return (
        <Case>
            <div className="container">
                <div className="card p-5 shadow">
                    <h1 className="text-center mb-4">
                        Créer une convention de stage
                    </h1>
                    {message.msg && (
                        <p className={`text-center text-${message.color}`}>{message.msg}</p>
                    )}
                    {/* Champs du formulaire */}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="hidden"
                            name="user_id"
                            value={formData.user_id}
                        />
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Nom de l'entreprise :
                                </label>
                                <input
                                    type="text"
                                    name="entreprise_nom"
                                    value={formData.entreprise_nom}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Adresse de l'entreprise :
                                </label>
                                <input
                                    type="text"
                                    name="entreprise_adresse"
                                    value={formData.entreprise_adresse}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Téléphone de l'entreprise :
                                </label>
                                <input
                                    type="text"
                                    name="entreprise_telephone"
                                    value={formData.entreprise_telephone}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Fax de l'entreprise :
                                </label>
                                <input
                                    type="text"
                                    name="entreprise_fax"
                                    value={formData.entreprise_fax}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Représentant de l'entreprise :
                                </label>
                                <input
                                    type="text"
                                    name="entreprise_representant"
                                    value={formData.entreprise_representant}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Nom du stagiaire :
                                </label>
                                <input
                                    type="text"
                                    name="stagiaire_nom"
                                    value={formData.stagiaire_nom}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Code Masar du stagiaire :
                                </label>
                                <input
                                    type="text"
                                    name="stagiaire_code_masar"
                                    value={formData.stagiaire_code_masar}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Date de début :
                                </label>
                                <input
                                    type="date"
                                    name="date_debut"
                                    value={formData.date_debut}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Date de fin :
                                </label>
                                <input
                                    type="date"
                                    name="date_fin"
                                    value={formData.date_fin}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <button
                                type="submit"
                                className={`btn btn-lg btn-block btn-primary tw-text-black ${
                                    shake ? "shake" : ""
                                }`}
                            >
                                Créer la convention
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Case>
    );
};

