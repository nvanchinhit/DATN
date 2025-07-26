"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Save, CreditCard, User, Key, RefreshCw } from "lucide-react";

interface PaymentInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  tokenAuto: string;
  description?: string;
}

export default function PaymentPage() {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    tokenAuto: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load existing payment settings
  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch('http://localhost:5000/api/payment/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setPaymentInfo({
            bankName: data.data.bank_name || "",
            accountNumber: data.data.account_number || "",
            accountHolder: data.data.account_holder || "",
            tokenAuto: data.data.token_auto || "",
            description: data.data.description || "",
          });
        }
      } else if (response.status === 404) {
        // No existing settings, that's fine
        console.log("No existing payment settings found");
      } else {
        throw new Error('Failed to load payment settings');
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin thanh toán",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!paymentInfo.bankName || !paymentInfo.accountNumber || !paymentInfo.accountHolder || !paymentInfo.tokenAuto) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('http://localhost:5000/api/payment/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bankName: paymentInfo.bankName,
          accountNumber: paymentInfo.accountNumber,
          accountHolder: paymentInfo.accountHolder,
          tokenAuto: paymentInfo.tokenAuto,
          description: paymentInfo.description,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "✅ Cập nhật thành công!",
          description: `Đã lưu thông tin ngân hàng: ${paymentInfo.bankName} - ${paymentInfo.accountNumber}`,
        });
        loadPaymentSettings(); // Tải lại dữ liệu mới nhất
      } else {
        throw new Error(data.message || 'Failed to save payment settings');
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu thông tin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadPaymentSettings();
  };

  const handleReset = () => {
    setPaymentInfo({
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      tokenAuto: "",
      description: "",
    });
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Đang tải thông tin thanh toán...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cài đặt thanh toán</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Cấu hình thông tin thanh toán cho hệ thống
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Thông tin ngân hàng
            </CardTitle>
            <CardDescription>
              Nhập thông tin tài khoản ngân hàng để nhận thanh toán
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ngân hàng */}
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Tên ngân hàng *
                  </Label>
                  <Input
                    id="bankName"
                    placeholder="VD: Vietcombank, BIDV, Techcombank..."
                    value={paymentInfo.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                    required
                  />
                </div>

                {/* Số tài khoản */}
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Số tài khoản *
                  </Label>
                  <Input
                    id="accountNumber"
                    placeholder="VD: 1234567890"
                    value={paymentInfo.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    required
                  />
                </div>

                {/* Chủ tài khoản */}
                <div className="space-y-2">
                  <Label htmlFor="accountHolder" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Chủ tài khoản *
                  </Label>
                  <Input
                    id="accountHolder"
                    placeholder="VD: NGUYEN VAN A"
                    value={paymentInfo.accountHolder}
                    onChange={(e) => handleInputChange("accountHolder", e.target.value)}
                    required
                  />
                </div>

                {/* Token Auto */}
                <div className="space-y-2">
                  <Label htmlFor="tokenAuto" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Token Auto *
                  </Label>
                  <Input
                    id="tokenAuto"
                    type="password"
                    placeholder="Nhập token auto"
                    value={paymentInfo.tokenAuto}
                    onChange={(e) => handleInputChange("tokenAuto", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Mô tả thêm */}
              <div className="space-y-2">
                <Label htmlFor="description">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="description"
                  placeholder="Thêm ghi chú về cấu hình thanh toán..."
                  rows={3}
                  value={paymentInfo.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Đang lưu..." : "Lưu cấu hình"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Làm mới
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tải lại
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 