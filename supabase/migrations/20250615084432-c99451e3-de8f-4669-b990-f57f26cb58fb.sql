
-- Create inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_name TEXT,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('cash', 'credit')),
  total_amount DECIMAL(10,2) NOT NULL,
  due_date DATE,
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sale_items table to track individual items in each sale
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table to track credit payments
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (for future authentication)
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (will be restricted with authentication later)
CREATE POLICY "Allow all operations on inventory" ON public.inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sale_items" ON public.sale_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample data
INSERT INTO public.inventory (name, description, quantity, price, low_stock_threshold) VALUES
('Premium Coffee Beans', 'High-quality arabica coffee beans', 45, 15.99, 20),
('Organic Tea Bags', 'Assorted organic tea collection', 8, 12.50, 15),
('Ceramic Mugs', 'Handcrafted ceramic mugs', 25, 18.00, 10);

INSERT INTO public.sales (date, customer_name, payment_type, total_amount, due_date, paid) VALUES
(CURRENT_DATE, 'John Smith', 'cash', 125.50, NULL, true),
(CURRENT_DATE, 'Mary Johnson', 'credit', 200.00, CURRENT_DATE + INTERVAL '30 days', false),
(CURRENT_DATE - INTERVAL '1 day', 'Bob Wilson', 'cash', 85.75, NULL, true);

INSERT INTO public.sale_items (sale_id, item_name, quantity, price, subtotal) VALUES
((SELECT id FROM public.sales WHERE customer_name = 'John Smith'), 'Premium Coffee Beans', 2, 15.99, 31.98),
((SELECT id FROM public.sales WHERE customer_name = 'John Smith'), 'Ceramic Mugs', 1, 18.00, 18.00),
((SELECT id FROM public.sales WHERE customer_name = 'Mary Johnson'), 'Premium Coffee Beans', 5, 15.99, 79.95),
((SELECT id FROM public.sales WHERE customer_name = 'Mary Johnson'), 'Organic Tea Bags', 3, 12.50, 37.50);
