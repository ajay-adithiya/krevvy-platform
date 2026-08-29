import { IsString, IsOptional, IsInt, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGlobalSiteContentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() seoGlobalTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() seoGlobalDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() seoOgMediaId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() logoMediaId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() footerBrandDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() copyrightText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complianceText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobileMenuOpenLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobileMenuCloseLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hqAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() companyName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessHours?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() defaultAmazonProductId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() buyOnAmazonLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amazonModalTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amazonModalSubtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amazonModalContinueLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amazonModalCancelLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amazonModalTrustText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amazonModalVerifiedLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amazonModalItemLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() amazonModalPriceLabel?: string;
}

export class UpdateHomePageContentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() heroEyebrow?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() heroTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() heroSubtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() heroCtaLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() heroMediaId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() searchPlaceholder?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() searchButtonLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() collectionEyebrow?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() collectionTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() collectionDescription?: string;
}

export class UpdateProductsPageContentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() pageEyebrow?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pageTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pageSubtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emptySearchMessage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() allProductsLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() viewTechSpecsLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hideTechSpecsLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() categoriesFilterLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() newArrivalsFilterLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bestSellersFilterLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() onDiscountFilterLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inStockLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warrantyLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() featuresHeadingLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() clearFilterLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() viewDetailsButtonLabel?: string;
}

export class UpdateAboutPageContentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() credoEyebrow?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() credoTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() narrativeText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() manufacturingBaseTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() manufacturingBaseSubtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificationTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificationDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificationBadgeLabel?: string;
}

export class UpdateContactPageContentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() headerEyebrow?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() headerTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() headerSubtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warrantyCardTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warrantyCardText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() formNameLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() formEmailLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() formPhoneLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() formCategoryLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() formMessageLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() formSubmitLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() validationRequiredMessage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() validationEmailMessage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() successMessageTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() successMessageDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() successResetButtonLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactTouchpointsHeading?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactPhoneHeading?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactEmailHeading?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactAddressHeading?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() formLoadingMessage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() successTicketPrefixLabel?: string;
}

export class UpdateFaqPageContentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() headerEyebrow?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() headerTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() headerSubtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fallbackSupportText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() allFaqsLabel?: string;
}
