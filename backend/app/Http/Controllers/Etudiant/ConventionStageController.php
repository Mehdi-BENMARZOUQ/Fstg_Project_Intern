<?php

namespace App\Http\Controllers\Etudiant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ConventionStage;
class ConventionStageController extends Controller
{
    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['error' => 'User ID is null'], 400);
        }
        // Validation des données
        $request->validate([
            'entreprise_nom' => 'required|string|max:255',
            'entreprise_adresse' => 'required|string|max:255',
            'entreprise_telephone' => 'required|string|max:20',
            'entreprise_fax' => 'nullable|string|max:20',
            'entreprise_representant' => 'required|string|max:255',
            'stagiaire_nom' => 'required|string|max:255',
            'stagiaire_code_masar' => 'required|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ]);

        // Création de la convention de stage
        $conventionStage = ConventionStage::create([
            'entreprise_nom' => $request->entreprise_nom,
            'entreprise_adresse' => $request->entreprise_adresse,
            'entreprise_telephone' => $request->entreprise_telephone,
            'entreprise_fax' => $request->entreprise_fax,
            'entreprise_representant' => $request->entreprise_representant,
            'stagiaire_nom' => $request->stagiaire_nom,
            'stagiaire_code_masar' => $request->stagiaire_code_masar,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'user_id' => $request->user_id, // ID de l'utilisateur connecté
            'is_telecharger' => false,
            'is_valider' => false,
            'is_signer' => false,
        ]);

        return response()->json($conventionStage, 201); // Retourne la convention créée
    }

    // Récupérer toutes les conventions
    public function index()
    {
        $conventions = ConventionStage::all();
        return response()->json($conventions);
    }

    public function update(Request $request, $id)
    {
        $convention = ConventionStage::find($id);

        if (!$convention) {
            return response()->json(['message' => 'Convention non trouvée'], 404);
        }

        // Valider les données de la requête
        $request->validate([
            'entreprise_nom' => 'required|string|max:255',
            'entreprise_adresse' => 'required|string|max:255',
            'entreprise_telephone' => 'required|string|max:20',
            'entreprise_fax' => 'nullable|string|max:20',
            'entreprise_representant' => 'required|string|max:255',
            'stagiaire_nom' => 'required|string|max:255',
            'stagiaire_code_masar' => 'required|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ]);

        // Mettre à jour la convention
        $convention->update($request->all());

        return response()->json($convention, 200);
    }




    // Supprimer une convention
    public function destroy($id)
    {
        $convention = ConventionStage::find($id);

        if (!$convention) {
            return response()->json(['message' => 'Convention non trouvée'], 404);
        }

        $convention->delete();

        return response()->json(['message' => 'Convention supprimée avec succès'], 200);
    }


    public function checkUserConvention($user_id)
    {
        $exists = ConventionStage::where('user_id', $user_id)->exists();
        return response()->json(['exists' => $exists]);
    }

}
