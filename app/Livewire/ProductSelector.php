<?php

namespace App\Livewire;

use App\Modules\Dataset\Models\Product;
use Livewire\Component;

class ProductSelector extends Component
{
    public $selectedProduct;

    public function mount()
    {
        $this->selectedProduct = request()->query('product');
    }

    public function updatedSelectedProduct()
    {
        $this->dispatch('product-selected', $this->selectedProduct);
    }

    public function render()
    {
        return view('livewire.product-selector', [
            'products' => Product::all()
        ]);
    }
}
