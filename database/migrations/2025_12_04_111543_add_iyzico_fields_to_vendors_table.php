<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * iyzico SubMerchant entegrasyonu için gerekli alanlar:
     * - merchant_type: PERSONAL / PRIVATE_COMPANY / LIMITED_OR_JOINT_STOCK_COMPANY
     * - identity_number: TC Kimlik No (PERSONAL ve PRIVATE_COMPANY için zorunlu)
     * - contact_name/surname: İletişim kişisi (PERSONAL için zorunlu)
     * - tax_office: Vergi dairesi (PRIVATE_COMPANY ve LIMITED için zorunlu)
     * - legal_company_title: Yasal şirket ünvanı (PRIVATE_COMPANY ve LIMITED için zorunlu)
     * - iyzico_submerchant_key: iyzico'dan dönen benzersiz anahtar
     */
    public function up(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            // iyzico SubMerchant Type
            // PERSONAL = Bireysel satıcı
            // PRIVATE_COMPANY = Şahıs şirketi  
            // LIMITED_OR_JOINT_STOCK_COMPANY = Limited/Anonim şirket
            $table->enum('merchant_type', ['personal', 'private_company', 'limited_company'])
                ->nullable()
                ->after('status')
                ->comment('iyzico subMerchantType');

            // TC Kimlik No - PERSONAL ve PRIVATE_COMPANY için zorunlu
            $table->string('identity_number', 11)
                ->nullable()
                ->after('merchant_type')
                ->comment('TC Kimlik Numarası (11 hane)');

            // İletişim Kişisi - PERSONAL için zorunlu
            $table->string('contact_name', 100)
                ->nullable()
                ->after('identity_number')
                ->comment('İletişim kişisi adı');

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
                ->comment('Yasal şirket ünvanı (Ticaret sicil kaydındaki)');

            // iyzico SubMerchant Key - iyzico'dan dönen benzersiz anahtar
            // Bu key ödemelerde subMerchant tanımlaması için kullanılır
            $table->string('iyzico_submerchant_key', 100)
                ->nullable()
                ->unique()
                ->after('legal_company_title')
                ->comment('iyzico tarafından atanan subMerchant anahtarı');

            // iyzico Onay Durumu
            $table->enum('iyzico_status', ['pending', 'active', 'rejected', 'not_registered'])
                ->default('not_registered')
                ->after('iyzico_submerchant_key')
                ->comment('iyzico SubMerchant kayıt durumu');

            // iyzico'ya son gönderim tarihi
            $table->timestamp('iyzico_registered_at')
                ->nullable()
                ->after('iyzico_status')
                ->comment('iyzico SubMerchant kayıt tarihi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropColumn([
                'merchant_type',
                'identity_number',
                'contact_name',
                'contact_surname',
                'tax_office',
                'legal_company_title',
                'iyzico_submerchant_key',
                'iyzico_status',
                'iyzico_registered_at',
            ]);
        });
    }
};
