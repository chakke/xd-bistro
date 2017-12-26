export interface ProductCategory {
    firebaseId: string;
    firebaseReference: string;
    id: string;
    name: string;
    en: string;
    vie: string;
    
}

export interface ProductSize {
    code: string;
    id: string;
    name: string;
}

export interface ProductState {
    code: string;
    id: string;
    name: string;
}

export interface ProductType { 
    id: string;
    name: string;
}

export interface ProductUnit {
    code: string;
    id: string;
    name: string; 
}