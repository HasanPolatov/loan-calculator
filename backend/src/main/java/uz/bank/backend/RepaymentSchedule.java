package uz.bank.backend;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RepaymentSchedule {

    @JsonFormat(pattern = "dd.MM.yyyy")
    private LocalDate date;
    private BigDecimal loanBalance;
    private BigDecimal loanRepaymentAmount;
    private BigDecimal loanInterestsAmount;
    private BigDecimal totalForRepayment;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getLoanBalance() {
        return loanBalance;
    }

    public void setLoanBalance(BigDecimal loanBalance) {
        this.loanBalance = loanBalance;
    }

    public BigDecimal getLoanRepaymentAmount() {
        return loanRepaymentAmount;
    }

    public void setLoanRepaymentAmount(BigDecimal loanRepaymentAmount) {
        this.loanRepaymentAmount = loanRepaymentAmount;
    }

    public BigDecimal getLoanInterestsAmount() {
        return loanInterestsAmount;
    }

    public void setLoanInterestsAmount(BigDecimal loanInterestsAmount) {
        this.loanInterestsAmount = loanInterestsAmount;
    }

    public BigDecimal getTotalForRepayment() {
        return totalForRepayment;
    }

    public void setTotalForRepayment(BigDecimal totalForRepayment) {
        this.totalForRepayment = totalForRepayment;
    }

}
