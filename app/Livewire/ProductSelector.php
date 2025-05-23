<?php

namespace App\Livewire;

use App\Modules\Dataset\Models\Product;
use Livewire\Component;

class ProductSelector extends Component
{
    public $selectedProduct;
    public $products;

    public function mount()
    {
        $this->products = Product::all();
        $this->selectedProduct = request()->query('product');
    }

    public function updatedSelectedProduct()
    {
        $this->emit('productSelected', $this->selectedProduct);
    }

    public function render()
    {
        return view('livewire.product-selector');
    }
}
