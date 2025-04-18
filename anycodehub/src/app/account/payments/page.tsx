"use client";

import React, { useState } from "react";
import { CreditCard, FileText, Download, Shield, Filter, Calendar, AlertCircle, CheckCircle, Link2, Plus, Trash, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/components/ui/use-toast";

// Mock payment data
const mockPayments = [
  {
    id: "INV-2023-1005",
    courseTitle: "Advanced React Patterns",
    amount: 599000,
    date: "2023-11-15T10:30:00",
    status: "completed",
    paymentMethod: "credit_card",
    cardInfo: {
      brand: "Visa",
      last4: "4242"
    },
    receiptUrl: "#",
    tax: 59900,
    total: 658900
  },
  {
    id: "INV-2023-0923",
    courseTitle: "TypeScript for Professionals",
    amount: 499000,
    date: "2023-09-23T14:15:00",
    status: "completed",
    paymentMethod: "momo",
    receiptUrl: "#",
    tax: 49900,
    total: 548900
  },
  {
    id: "INV-2023-0817",
    courseTitle: "Docker & Kubernetes",
    amount: 699000,
    date: "2023-08-17T09:20:00",
    status: "completed",
    paymentMethod: "bank_transfer",
    bankInfo: {
      bank: "Vietcombank",
      reference: "VCB12345"
    },
    receiptUrl: "#",
    tax: 69900,
    total: 768900
  },
  {
    id: "INV-2023-0602",
    courseTitle: "NextJS Masterclass",
    amount: 799000,
    date: "2023-06-02T16:45:00",
    status: "refunded",
    paymentMethod: "credit_card",
    cardInfo: {
      brand: "Mastercard",
      last4: "5678"
    },
    receiptUrl: "#",
    tax: 79900,
    total: 878900,
    refundDate: "2023-06-05T10:20:00",
    refundReason: "Requested by customer"
  },
  {
    id: "INV-2023-0405",
    courseTitle: "Advanced CSS and Sass",
    amount: 399000,
    date: "2023-04-05T13:30:00",
    status: "completed",
    paymentMethod: "paypal",
    receiptUrl: "#",
    tax: 39900,
    total: 438900
  }
];

// Mock subscription data
const mockSubscription = {
  id: "SUB-2023-0001",
  plan: "Premium Plus",
  status: "active",
  amount: 199000,
  billingCycle: "monthly",
  nextBillingDate: "2024-01-15T00:00:00",
  paymentMethod: {
    type: "credit_card",
    brand: "Visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025
  },
  startDate: "2023-07-15T00:00:00",
  features: [
    "Truy cập tất cả khóa học",
    "Tải xuống nội dung offline",
    "Chứng chỉ hoàn thành",
    "Hỗ trợ qua email ưu tiên",
    "Cập nhật nội dung mới nhất"
  ]
};

type Payment = typeof mockPayments[0];

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  cardType?: "visa" | "mastercard" | "amex" | "discover";
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  description: string;
  paymentMethod: string;
  receiptUrl?: string;
}

export default function PaymentsPage() {
  const getUser = useAuthStore((state) => state.getUser);
  const user = getUser();
  const [payments, setPayments] = useState(mockPayments);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("history");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "card",
      name: "Visa ending in 4242",
      lastFour: "4242",
      expiryDate: "12/2024",
      isDefault: true,
      cardType: "visa",
    },
    {
      id: "pm_2",
      type: "paypal",
      name: "PayPal - johndoe@example.com",
      isDefault: false,
    },
    {
      id: "pm_3",
      type: "card",
      name: "Mastercard ending in 5555",
      lastFour: "5555",
      expiryDate: "09/2025",
      isDefault: false,
      cardType: "mastercard",
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx_1",
      date: "2023-12-15",
      amount: 49.99,
      status: "completed",
      description: "Advanced React Development Course",
      paymentMethod: "Visa ending in 4242",
      receiptUrl: "/receipts/tx_1.pdf",
    },
    {
      id: "tx_2",
      date: "2023-11-10",
      amount: 19.99,
      status: "completed",
      description: "JavaScript Fundamentals Course",
      paymentMethod: "PayPal - johndoe@example.com",
      receiptUrl: "/receipts/tx_2.pdf",
    },
    {
      id: "tx_3",
      date: "2023-10-05",
      amount: 29.99,
      status: "refunded",
      description: "UI/UX Design Principles Course",
      paymentMethod: "Mastercard ending in 5555",
      receiptUrl: "/receipts/tx_3.pdf",
    },
    {
      id: "tx_4",
      date: "2023-09-20",
      amount: 99.99,
      status: "completed",
      description: "Annual Premium Subscription",
      paymentMethod: "Visa ending in 4242",
      receiptUrl: "/receipts/tx_4.pdf",
    },
    {
      id: "tx_5",
      date: "2023-08-15",
      amount: 39.99,
      status: "failed",
      description: "Node.js Backend Development Course",
      paymentMethod: "Mastercard ending in 5555",
    },
  ]);

  const [subscriptions, setSubscriptions] = useState([
    {
      id: "sub_1",
      name: "Premium Subscription",
      status: "active",
      nextBillingDate: "2024-09-20",
      amount: 99.99,
      billingCycle: "yearly",
      paymentMethod: "Visa ending in 4242",
    },
  ]);

  // Filter payments based on selected filters
  const filteredPayments = payments.filter(payment => {
    const matchesYear = yearFilter === "all" 
      ? true 
      : new Date(payment.date).getFullYear() === parseInt(yearFilter);
    
    const matchesStatus = statusFilter === "all" 
      ? true 
      : payment.status === statusFilter;
    
    return matchesYear && matchesStatus;
  });

  const uniqueYears = Array.from(
    new Set(payments.map(payment => new Date(payment.date).getFullYear()))
  ).sort((a, b) => b - a);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Đang xử lý
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            Thất bại
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Link2 className="h-3.5 w-3.5 mr-1" />
            Hoàn tiền
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4 text-purple-500 dark:text-purple-400" />;
      case "paypal":
        return <Shield className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case "bank_transfer":
        return <Link2 className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case "momo":
        return <Shield className="h-4 w-4 text-pink-500 dark:text-pink-400" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    });
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(
      paymentMethods.filter(method => method.id !== id)
    );
    
    toast({
      title: "Payment method removed",
      description: "The payment method has been removed from your account.",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-gray-200 dark:border-gray-700/50 shadow-md dark:shadow-lg dark:shadow-purple-900/5">
        <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500"></div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Thanh toán & Đăng ký
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-300 mt-1">
            Quản lý thanh toán, hóa đơn và đăng ký của bạn
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800/70">
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50"
              >
                Lịch sử giao dịch
              </TabsTrigger>
              <TabsTrigger 
                value="subscription"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50"
              >
                Gói đăng ký
              </TabsTrigger>
              <TabsTrigger 
                value="methods"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/50"
              >
                Phương thức thanh toán
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-0">
              {/* Filter options */}
              <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lọc:</span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[140px] h-9 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <SelectValue placeholder="Năm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả các năm</SelectItem>
                      {uniqueYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] h-9 text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="pending">Đang xử lý</SelectItem>
                      <SelectItem value="refunded">Hoàn tiền</SelectItem>
                      <SelectItem value="failed">Thất bại</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Payments list */}
              {filteredPayments.length > 0 ? (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <Card key={payment.id} className="overflow-hidden">
                      <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{payment.courseTitle}</h3>
                            {getStatusBadge(payment.status)}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>{payment.id}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(payment.date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                              <span className="capitalize">
                                {payment.paymentMethod === "credit_card" && `${payment.cardInfo.brand} ****${payment.cardInfo.last4}`}
                                {payment.paymentMethod === "bank_transfer" && `${payment.bankInfo.bank}`}
                                {payment.paymentMethod === "momo" && "MoMo"}
                                {payment.paymentMethod === "paypal" && "PayPal"}
                              </span>
                            </div>
                          </div>
                          
                          {payment.status === "refunded" && (
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                              <span>Hoàn tiền {formatDate(payment.refundDate)}</span>
                              {payment.refundReason && <span> — {payment.refundReason}</span>}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(payment.total)}
                          </span>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 text-sm border-gray-200 dark:border-gray-700"
                              onClick={() => window.open(payment.receiptUrl, "_blank")}
                            >
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              Xem hóa đơn
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 text-sm border-gray-200 dark:border-gray-700"
                              onClick={() => window.open(payment.receiptUrl, "_blank")}
                            >
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Tải PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Không có giao dịch</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
                    Không tìm thấy giao dịch nào phù hợp với bộ lọc đã chọn.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="subscription" className="mt-0">
              {mockSubscription ? (
                <div>
                  <Card className="border-purple-200 dark:border-purple-900/30">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Đang hoạt động
                            </Badge>
                            
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {mockSubscription.plan}
                            </h3>
                          </div>
                          
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Đăng ký từ {formatDate(mockSubscription.startDate)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:items-end">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(mockSubscription.amount)}
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / tháng</span>
                          </span>
                          
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Gia hạn tiếp theo: {formatDate(mockSubscription.nextBillingDate)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <Separator className="my-4" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Quyền lợi của bạn
                          </h4>
                          
                          <ul className="space-y-2">
                            {mockSubscription.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Phương thức thanh toán
                          </h4>
                          
                          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-10 w-10 text-purple-600 dark:text-purple-500 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full" />
                              
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {mockSubscription.paymentMethod.brand} ****{mockSubscription.paymentMethod.last4}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Hết hạn: {mockSubscription.paymentMethod.expiryMonth}/{mockSubscription.paymentMethod.expiryYear}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-3">
                            <Button 
                              variant="default" 
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 text-white"
                            >
                              Thay đổi gói
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                              Hủy đăng ký
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Không có đăng ký</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
                    Bạn chưa đăng ký gói dịch vụ nào.
                  </p>
                  <Button 
                    variant="default" 
                    className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    Khám phá các gói đăng ký
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="methods" className="mt-0">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Phương thức thanh toán đã lưu
                  </h3>
                  
                  <Button 
                    onClick={() => setShowPaymentMethods(!showPaymentMethods)}
                    className="mt-2 sm:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 text-white"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Thêm phương thức mới
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Card className="overflow-hidden border-gray-200 dark:border-gray-700/50">
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-10 w-10 text-purple-600 dark:text-purple-500 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full" />
                        
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {mockSubscription.paymentMethod.brand} ****{mockSubscription.paymentMethod.last4}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Hết hạn: {mockSubscription.paymentMethod.expiryMonth}/{mockSubscription.paymentMethod.expiryYear}
                          </p>
                          <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Phương thức mặc định
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-9 border-gray-200 dark:border-gray-700"
                        >
                          Cập nhật
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-9 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
                
                {showPaymentMethods && (
                  <Card className="overflow-hidden border-gray-200 dark:border-gray-700/50 mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Thêm phương thức thanh toán mới</CardTitle>
                      <CardDescription>
                        Thêm thẻ mới hoặc phương thức thanh toán khác cho tài khoản của bạn
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="cursor-pointer border-2 border-purple-200 dark:border-purple-900/30 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                          <div className="p-4 text-center">
                            <CreditCard className="h-12 w-12 mx-auto text-purple-600 dark:text-purple-500 mb-3" />
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Thẻ tín dụng/ghi nợ</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visa, Mastercard, JCB</p>
                          </div>
                        </Card>
                        
                        <Card className="cursor-pointer border-2 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                          <div className="p-4 text-center">
                            <Shield className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-500 mb-3" />
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">MoMo / Ví điện tử</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">MoMo, ZaloPay, VNPay</p>
                          </div>
                        </Card>
                      </div>
                      
                      <div className="mt-6 flex justify-end gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowPaymentMethods(false)}
                        >
                          Hủy
                        </Button>
                        
                        <Button>
                          Tiếp tục
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}