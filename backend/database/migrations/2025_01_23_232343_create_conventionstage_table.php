<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('convention_stages', function (Blueprint $table) {
            $table->id();
            $table->string('entreprise_nom'); // Nom de l'entreprise
            $table->string('entreprise_adresse'); // Adresse de l'entreprise
            $table->string('entreprise_telephone'); // Téléphone de l'entreprise
            $table->string('entreprise_fax'); // Fax de l'entreprise
            $table->string('entreprise_representant'); // Représentant de l'entreprise
            $table->string('stagiaire_nom'); // Nom du stagiaire
            $table->string('stagiaire_code_masar'); // Code Masar du stagiaire
            $table->date('date_debut'); // Date de début du stage
            $table->date('date_fin'); // Date de fin du stage

            // Clé étrangère pour l'utilisateur
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Champs booléens initialisés à false
            $table->boolean('is_telecharger')->default(false); // Téléchargé
            $table->boolean('is_valider')->default(false); // Validé
            $table->boolean('is_signer')->default(false); // Signé

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convention_stages');
    }
};
