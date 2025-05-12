<?php

declare(strict_types=1);

namespace Tests\Unit\Modules\Data;

use App\Modules\Dataset\Actions\TransformCsvRowToMessage;
use App\Modules\Dataset\Messages\DatasetRow;
use DateTimeImmutable;
use Generator;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class TransformCsvRowToMessageTest extends TestCase
{
    #[DataProvider('csvRowProvider')]
    public function testTransformsCsvRowToMessage(array $row, DatasetRow $expected): void
    {
        $this->assertEquals($expected, $this->app->make(TransformCsvRowToMessage::class)->invoke($row));
    }

    public static function csvRowProvider(): Generator
    {
        yield 'with all fields' => [
            'row' => [
                '2017-12',
                '348',
                '30-60588371-7',
                'ABELLA Y ALONSO S.R.L.',
                'MORENO 1701',
                'VILLA  BALLESTER',
                'BUENOS AIRES',
                'PAMPEANA',
                '19',
                'Gas Oil Grado 2',
                '2',
                'Diurno',
                '22.99',
                '2017-12-06 11:34:00',
                '1',
                'BLANCA',
                '-34.533377',
                '-58.557665',
                '{""type"":""Point"",""coordinates"":[-58.557665,-34.533377]}',
            ],
            'expected' => new DatasetRow(
                timeIndex: '2017-12',
                companyId: 348,
                cuit: '30-60588371-7',
                companyName: 'ABELLA Y ALONSO S.R.L.',
                address: 'MORENO 1701',
                city: 'VILLA  BALLESTER',
                province: 'BUENOS AIRES',
                region: 'PAMPEANA',
                productId: 19,
                productName: 'Gas Oil Grado 2',
                scheduleId: 2,
                scheduleName: 'Diurno',
                price: 22.99,
                validityDate: new DateTimeImmutable('2017-12-06 11:34:00'),
                franchiseId: 1,
                franchiseName: 'BLANCA',
                longitude: -58.557665,
                latitude: -34.533377,
                geoJson: '{""type"":""Point"",""coordinates"":[-58.557665,-34.533377]}',
            ),
        ];
        yield 'without region' => [
            'row' => [
                '2025-04',
                '11075',
                '30-71322460-6',
                'ABELAR SERVICIOS SRL',
                'Ruta Nacional 7 Km 952- LATERAL NORTE',
                'LAS CATITAS',
                'MENDOZA',
                '',
                '6',
                'GNC',
                '2',
                'Diurno',
                '599',
                '2025-04-01 15:14:00',
                '26',
                'AXION',
                '-37.84097',
                '-58.24857',
                '{""type"":""Point"",""coordinates"":[-58.24857,-37.84097]}',
            ],
            'expected' => new DatasetRow(
                timeIndex: '2025-04',
                companyId: 11075,
                cuit: '30-71322460-6',
                companyName: 'ABELAR SERVICIOS SRL',
                address: 'Ruta Nacional 7 Km 952- LATERAL NORTE',
                city: 'LAS CATITAS',
                province: 'MENDOZA',
                region: null,
                productId: 6,
                productName: 'GNC',
                scheduleId: 2,
                scheduleName: 'Diurno',
                price: 599,
                validityDate: new DateTimeImmutable('2025-04-01 15:14:00'),
                franchiseId: 26,
                franchiseName: 'AXION',
                longitude: -58.24857,
                latitude: -37.84097,
                geoJson: '{""type"":""Point"",""coordinates"":[-58.24857,-37.84097]}',
            ),
        ];

        yield 'without coordinates' => [
            'row' => [
                '2025-04',
                '11139',
                '33-71540749-9',
                'ADMA S.A.',
                'ACCESO ESTE ESQUINA ISIDRO MAZA, Acceso',
                'FRAY LUIS BELTRAN',
                'MENDOZA',
                '',
                '21',
                'Gas Oil Grado 3',
                '2',
                'Diurno',
                '1536',
                '2025-04-07 13:25:00',
                '26',
                'AXION',
                '',
                '',
                '',
            ],
            'expected' => new DatasetRow(
                timeIndex: '2025-04',
                companyId: 11139,
                cuit: '33-71540749-9',
                companyName: 'ADMA S.A.',
                address: 'ACCESO ESTE ESQUINA ISIDRO MAZA, Acceso',
                city: 'FRAY LUIS BELTRAN',
                province: 'MENDOZA',
                region: null,
                productId: 21,
                productName: 'Gas Oil Grado 3',
                scheduleId: 2,
                scheduleName: 'Diurno',
                price: 1536,
                validityDate: new DateTimeImmutable('2025-04-07 13:25:00'),
                franchiseId: 26,
                franchiseName: 'AXION',
                longitude: null,
                latitude: null,
                geoJson: null,
            ),
        ];
    }
}
