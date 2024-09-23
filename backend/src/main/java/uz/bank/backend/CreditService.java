package uz.bank.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CreditService {

    public ResponseEntity<List<RepaymentSchedule>> getRepaymentSchedule(
            Long loanAmount,
            Integer term,
            Integer interestRate,
            RepaymentType repaymentType
    ) {

        List<RepaymentSchedule> schedule = new ArrayList<>();
        RepaymentSchedule summary = getStartSummary();
        BigDecimal remainingBalance = BigDecimal.valueOf(loanAmount);
        BigDecimal monthlyInterestRate = BigDecimal.valueOf(interestRate)
                .divide(BigDecimal.valueOf(12 * 100), 2, RoundingMode.HALF_UP);
        LocalDate currentDate = LocalDate.now();

        if (repaymentType == RepaymentType.ANNUITY) {

            BigDecimal annuityPayment = calculateAnnuityPayment(remainingBalance, monthlyInterestRate, term);

            for (int month = 1; month <= term; month++) {
                RepaymentSchedule payment = new RepaymentSchedule();
                payment.setDate(currentDate.plusMonths(month));

                BigDecimal interestPayment = remainingBalance.multiply(monthlyInterestRate);
                BigDecimal principalPayment = annuityPayment.subtract(interestPayment);

                if (month == term) {
                    principalPayment = remainingBalance;
                    annuityPayment = principalPayment.add(interestPayment);
                }

                remainingBalance = setValues(
                        schedule,
                        summary,
                        remainingBalance,
                        annuityPayment,
                        payment,
                        interestPayment,
                        principalPayment
                );
            }
        } else if (repaymentType == RepaymentType.DIFFERENTIAL) {

            BigDecimal fixedPrincipalPayment = remainingBalance.divide(
                    BigDecimal.valueOf(term), 2, RoundingMode.HALF_UP
            );

            for (int month = 1; month <= term; month++) {
                RepaymentSchedule payment = new RepaymentSchedule();
                payment.setDate(currentDate.plusMonths(month));

                BigDecimal interestPayment = remainingBalance.multiply(monthlyInterestRate);
                BigDecimal totalPayment = fixedPrincipalPayment.add(interestPayment);

                remainingBalance = setValues(
                        schedule,
                        summary,
                        remainingBalance,
                        totalPayment,
                        payment,
                        interestPayment,
                        fixedPrincipalPayment
                );
            }
        }

        schedule.add(summary);

        return ResponseEntity.ok(schedule);
    }

    private BigDecimal setValues(
            List<RepaymentSchedule> schedule,
            RepaymentSchedule summary,
            BigDecimal remainingBalance,
            BigDecimal annuityPayment,
            RepaymentSchedule payment,
            BigDecimal interestPayment,
            BigDecimal principalPayment
    ) {
        payment.setLoanBalance(remainingBalance);
        payment.setLoanRepaymentAmount(principalPayment);
        payment.setLoanInterestsAmount(interestPayment);
        payment.setTotalForRepayment(annuityPayment);

        summary.setLoanRepaymentAmount(summary.getLoanRepaymentAmount().add(principalPayment));
        summary.setLoanInterestsAmount(summary.getLoanInterestsAmount().add(interestPayment));
        summary.setTotalForRepayment(summary.getTotalForRepayment().add(annuityPayment));

        schedule.add(payment);
        remainingBalance = remainingBalance.subtract(principalPayment);
        return remainingBalance;
    }

    private BigDecimal calculateAnnuityPayment(
            BigDecimal loanAmount,
            BigDecimal monthlyInterestRate,
            Integer term
    ) {
        BigDecimal interestPlusOne = monthlyInterestRate.add(BigDecimal.ONE);
        BigDecimal poweredInterest = interestPlusOne.pow(term);
        return loanAmount.multiply(monthlyInterestRate.multiply(poweredInterest))
                .divide(poweredInterest.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);
    }

    private RepaymentSchedule getStartSummary() {

        RepaymentSchedule sum = new RepaymentSchedule();
        sum.setLoanRepaymentAmount(BigDecimal.ZERO);
        sum.setLoanInterestsAmount(BigDecimal.ZERO);
        sum.setTotalForRepayment(BigDecimal.ZERO);

        return sum;
    }

}
