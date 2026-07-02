import type { Metadata } from "next";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <Container>
          <div className="py-8 sm:py-12">
            <h1 className="text-3xl sm:text-4xl mb-6">Checkout</h1>
            <CheckoutClient />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
