<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConventionStage extends Model
{

    use HasFactory;
    protected $table = 'convention_stages';

    protected $fillable = [
        'entreprise_nom',
        'entreprise_adresse',
        'entreprise_telephone',
        'entreprise_fax',
        'entreprise_representant',
        'stagiaire_nom',
        'stagiaire_code_masar',
        'date_debut',
        'date_fin',
        'user_id',
        'is_telecharger',
        'is_valider',
        'is_signer',
    ];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
