export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          apelido: string | null
          cpf: string
          endereco: string
          id: string
          instagram: string | null
          nome: string
          numero_endereco: number
          saldo_devedor: number
          sobrenome: string
          telefone: string
          ultima_compra: string | null
          ultimo_pagamento: string | null
        }
        Insert: {
          apelido?: string | null
          cpf: string
          endereco: string
          id?: string
          instagram?: string | null
          nome: string
          numero_endereco?: number | null
          saldo_devedor: number
          sobrenome: string
          telefone: string
          ultima_compra?: string | null
          ultimo_pagamento?: string | null
        }
        Update: {
          apelido?: string | null
          cpf?: string
          endereco?: string
          id?: string
          instagram?: string | null
          nome?: string
          numero_endereco?: number | null
          saldo_devedor?: number | null
          sobrenome?: string
          telefone?: string
          ultima_compra?: string | null
          ultimo_pagamento?: string | null
        }
      }
      produtos: {
        Row: {
          categoria: string
          codigo: string
          codigo_barras: string
          cor: string | null
          data_cadastro: string | null
          descricao: string
          estoque: number
          genero: string
          id: number
          preco_custo: number
          preco_venda: number
          tamanho: string
        }
        Insert: {
          categoria?: string
          codigo: string
          codigo_barras: string
          cor?: string | null
          data_cadastro?: string | null
          descricao: string
          estoque?: number
          genero?: string
          id?: number
          preco_custo?: number
          preco_venda?: number
          tamanho?: string
        }
        Update: {
          categoria?: string
          codigo?: string
          codigo_barras?: string
          cor?: string | null
          data_cadastro?: string | null
          descricao?: string
          estoque?: number
          genero?: string
          id?: number
          preco_custo?: number
          preco_venda?: number
          tamanho?: string
        }
      }
      produtos_vendidos: {
        Row: {
          data_hora: string | null
          desconto: number
          id: number
          preco: number
          produto: number
          quantidade: number
        }
        Insert: {
          data_hora?: string | null
          desconto?: number
          id?: number
          preco?: number
          produto: number
          quantidade?: number
        }
        Update: {
          data_hora?: string | null
          desconto?: number
          id?: number
          preco?: number
          produto?: number
          quantidade?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

