package uz.bank.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin
@RestController
@RequestMapping("/api/v1/credit")
public class CreditController {

    private final CreditService creditService;

    public CreditController(CreditService creditService) {
        this.creditService = creditService;
    }

    @GetMapping("/repayment-schedule")
    public ResponseEntity<List<RepaymentSchedule>> getRepaymentSchedule(
            @RequestParam Long loanAmount,
            @RequestParam Integer term,
            @RequestParam Integer interestRate,
            @RequestParam RepaymentType repaymentType
    ) {
        return creditService.getRepaymentSchedule(
                loanAmount,
                term,
                interestRate,
                repaymentType
        );
    }

}
