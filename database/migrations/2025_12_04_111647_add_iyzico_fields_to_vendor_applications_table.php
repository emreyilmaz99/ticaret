<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * full_application türündeki başvurular için iyzico SubMerchant bilgileri.
     * Bu alanlar satıcı onaylandığında vendors tablosuna aktarılır.
     */
    public function up(): void
    {
        Schema::table('vendor_applications', function (Blueprint $table) {
            // Satıcı Türü - full_application için zorunlu
            $table->enum('merchant_type', ['personal', 'private_company', 'limited_company'])
                ->nullable()
                ->after('tax_id')
                ->comment('iyzico subMerchantType');

            // TC Kimlik No - PERSONAL ve PRIVATE_COMPANY için zorunlu
            $table->string('identity_number', 11)
                ->nullable()
                ->after('merchant_type')
                ->comment('TC Kimlik Numarası (11 hane)');

            // İletişim Kişisi Adı - PERSONAL için zorunlu
            $table->string('contact_name', 100)
                ->nullable()
                ->after('identity_number')
                ->comment('İletişim kişisi adı');

            // İletişim Kişisi Soyadı - PERSONAL için zorunlu
            $table->string('contact_surname', 100)
                ->nullable()
                ->after('contact_name')
                ->comment('İletişim kişisi soyadı');

            // Vergi Dairesi - PRIVATE_COMPANY ve LIMITED için zorunlu
            $table->string('tax_office', 100)
                ->nullable()
                ->after('contact_surname')
                ->comment('Vergi dairesi adı');

            // Yasal Şirket Ünvanı - PRIVATE_COMPANY ve LIMITED için zorunlu
            $table->string('legal_company_title', 255)
                ->nullable()
                ->after('tax_office')
                ->comment('Yasal şirket ünvanı');

            // IBAN - Tüm türler için zorunlu
            $table->string('iban', 34)
                ->nullable()
                ->after('legal_company_title')
                ->comment('Banka IBAN numarası');

            // Adres bilgileri (iyzico tek bir address stringi istiyor)
            $table->string('address', 500)
                ->nullable()
                ->after('iban')
                ->comment('Tam adres');

            $table->string('city', 100)
                ->nullable()
                ->after('address')
                ->comment('Şehir');

            $table->string('district', 100)
                ->nullable()
                ->after('city')
                ->comment('İlçe');

            $table->string('postal_code', 10)
                ->nullable()
                ->after('district')
                ->comment('Posta kodu');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor_applications', function (Blueprint $table) {
            $table->dropColumn([
                'merchant_type',
                'identity_number',
                'contact_name',
                'contact_surname',
                'tax_office',
                'legal_company_title',
                'iban',
                'address',
                'city',
                'district',
                'postal_code',
            ]);
        });
    }
};
