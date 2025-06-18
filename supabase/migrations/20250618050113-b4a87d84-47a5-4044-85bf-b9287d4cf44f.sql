
-- Enable RLS on all tables and add user_id columns where missing
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Add user_id to sales table if not exists (check first)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sales' AND column_name='user_id') THEN
        ALTER TABLE sales ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Add user_id to expenses table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='user_id') THEN
        ALTER TABLE expenses ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Add user_id to inventory table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='user_id') THEN
        ALTER TABLE inventory ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Create RLS policies for sales table
CREATE POLICY "Users can only see their own sales" ON sales
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for expenses table
CREATE POLICY "Users can only see their own expenses" ON expenses
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for inventory table
CREATE POLICY "Users can only see their own inventory" ON inventory
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for payments table (linked through sales)
CREATE POLICY "Users can only see their own payments" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM sales 
            WHERE sales.id = payments.sale_id 
            AND sales.user_id = auth.uid()
        )
    );

-- Create RLS policies for sale_items table (linked through sales)
CREATE POLICY "Users can only see their own sale items" ON sale_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM sales 
            WHERE sales.id = sale_items.sale_id 
            AND sales.user_id = auth.uid()
        )
    );
