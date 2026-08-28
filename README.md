# caixinha-core
core business rules of caixinha app

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/summary/new_code?id=Jean1dev_caixinha-core)

#WIP

## Definição de empréstimo atrasado

Um empréstimo está atrasado quando a primeira parcela ainda não integralmente paga possui data de vencimento anterior ao dia atual em `America/Sao_Paulo`.

- Pagamentos são alocados cronologicamente, começando pela parcela mais antiga.
- Pagamento parcial não quita a parcela; depois do vencimento, ela permanece atrasada.
- Parcelas futuras não impedem a renegociação quando existe uma parcela anterior vencida e não quitada.
- Um vencimento no dia atual não é atraso. O atraso começa no próximo dia civil.
- Empréstimos quitados não possuem próxima parcela nem dias de atraso.

`Loan.nextUnpaidBillingDate`, `Loan.calculateOverdueDays()` e `Loan.isOverdue` são a fonte canônica dessa regra. Fluxos de cobrança, listagem e renegociação devem consumir esses membros em vez de recalcular atraso de forma independente.
