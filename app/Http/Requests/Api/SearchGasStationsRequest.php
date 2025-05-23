<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SearchGasStationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'bounds' => ['required', 'array'],
            'bounds.north' => ['required', 'numeric', 'between:-90,90'],
            'bounds.south' => ['required', 'numeric', 'between:-90,90'],
            'bounds.east' => ['required', 'numeric', 'between:-180,180'],
            'bounds.west' => ['required', 'numeric', 'between:-180,180'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'El producto es requerido.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            'bounds.required' => 'Los límites del mapa son requeridos.',
            'bounds.*.required' => 'Todos los límites del mapa son requeridos.',
            'bounds.*.numeric' => 'Los límites del mapa deben ser numéricos.',
            'bounds.north.between' => 'La latitud norte debe estar entre -90 y 90.',
            'bounds.south.between' => 'La latitud sur debe estar entre -90 y 90.',
            'bounds.east.between' => 'La longitud este debe estar entre -180 y 180.',
            'bounds.west.between' => 'La longitud oeste debe estar entre -180 y 180.',
        ];
    }
}
