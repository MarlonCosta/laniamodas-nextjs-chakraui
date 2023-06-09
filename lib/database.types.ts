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
          saldo_devedor?: number
          sobrenome?: string
          telefone?: string
          ultima_compra?: string | null
          ultimo_pagamento?: string | null
        }
      }
      eventos_caixa: {
        Row: {
          data_hora: string
          id: number
          tipo_evento: string
          valor: number
        }
        Insert: {
          data_hora?: string
          id?: number
          tipo_evento: string
          valor: number
        }
        Update: {
          data_hora?: string
          id?: number
          tipo_evento?: string
          valor?: number
        }
      }
      pagamentos: {
        Row: {
          cliente: string
          data_hora: string
          forma_pagamento: string
          id: number
          valor: number
        }
        Insert: {
          cliente: string
          data_hora?: string
          forma_pagamento?: string
          id?: number
          valor?: number
        }
        Update: {
          cliente?: string
          data_hora?: string
          forma_pagamento?: string
          id?: number
          valor?: number
        }
      }
      produtos: {
        Row: {
          id: number
          codigo: string
          descricao: string
          codigo_barras: string
          cor: string | null
          data_cadastro: string | null
          categoria: string
          estoque: number
          genero: string
          preco_custo: number
          preco_venda: number
          tamanho: string
          marca: string
        }
        Insert: {
          categoria?: string
          codigo_barras: string
          cor?: string | null
          data_cadastro?: string | null
          descricao: string
          estoque?: number
          genero?: string
          id?: number
          marca?: string | null
          preco_custo?: number
          preco_venda?: number
          tamanho?: string
        }
        Update: {
          categoria?: string
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
          marca?: string
        }
      }
      vendas: {
        Row: {
          id: number
          cliente: string
          produto: number
          data_hora: string | null
          desconto: number
          forma_pagamento: string
          quantidade: number
        }
        Insert: {
          id?: number
          cliente: string
          data_hora?: string | null
          desconto?: number
          forma_pagamento?: string
          produto: number
          quantidade?: number
        }
        Update: {
          id?: number
          cliente?: string
          data_hora?: string | null
          desconto?: number
          forma_pagamento?: string
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

