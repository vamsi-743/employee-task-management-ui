import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Building2, BanknoteIcon } from "lucide-react";

interface PaymentOptionsProps {
  onDataChange: (data: any) => void;
}

export default function PaymentOptions({ onDataChange }: PaymentOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState("cheque");
  const [formData, setFormData] = useState({
    account_holder: "",
    bank_name: "",
    account_number: "",
      re_enter_account_number: "",
    ifsc: "",
    account_type: "savings",
  });

  useEffect(() => {
    onDataChange({ paymentMethod, ...formData });
  }, [paymentMethod, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({ ...prevData, accountType: e.target.id }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">How would you like to pay this employee?*</h2>
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <RadioGroupItem value="direct" id="direct" className="mr-4" />
            <Label htmlFor="direct" className="flex-1 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <div className="font-semibold">Direct Deposit (Automated Process)</div>
                <p className="text-sm text-muted-foreground">Initiate payment in Payroll once the pay run is approved</p>
              </div>
            </Label>
            <span className="text-sm text-blue-500">Configure Now</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <RadioGroupItem value="bank" id="bank" className="mr-4" />
            <Label htmlFor="bank" className="flex-1 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <div className="font-semibold">Bank Transfer (Manual Process)</div>
                <p className="text-sm text-muted-foreground">Download Bank Advice and process the payment through your banks website</p>
              </div>
            </Label>
          </CardContent>
        </Card>

        {paymentMethod === "bank" && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="account_holder">Account Holder Name*</Label>
                  <Input id="account_holder" value={formData.account_holder} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="bank_name">Bank Name*</Label>
                  <Input id="bank_name" value={formData.bank_name} onChange={handleInputChange} />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="account_number">Account Number*</Label>
                    <Input id="account_number" value={formData.account_number} onChange={handleInputChange} />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="re_enter_account_number">Re-enter Account Number*</Label>
                    <Input id="re_enter_account_number" value={formData.re_enter_account_number} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="ifsc">IFSC*</Label>
                    <Input id="ifsc" value={formData.ifsc} onChange={handleInputChange} placeholder="AAAA0000000" />
                  </div>
                  <div className="flex-1">
                    <Label>Account Type*</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <input type="radio" id="current" name="account_type" className="mr-2" checked={formData.account_type === "current"} onChange={handleRadioChange} />
                        <Label htmlFor="current">Current</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="savings" name="account_type" className="mr-2" checked={formData.account_type === "savings"} onChange={handleRadioChange} />
                        <Label htmlFor="savings">Savings</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="flex items-center p-6">
            <RadioGroupItem value="cheque" id="cheque" className="mr-4" />
            <Label htmlFor="cheque" className="flex-1 flex items-center">
              <BanknoteIcon className="h-5 w-5 mr-2 text-muted-foreground" />
              <div className="font-semibold">Cheque</div>
            </Label>
          </CardContent>
        </Card>
      </RadioGroup>
    </div>
  );
}