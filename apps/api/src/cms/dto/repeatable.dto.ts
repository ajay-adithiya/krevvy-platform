import { IsString, IsOptional, IsInt, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// NavigationItem
export class CreateNavigationItemDto {
  @ApiProperty() @IsString() label: string;
  @ApiProperty() @IsString() targetView: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}
export class UpdateNavigationItemDto {
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetView?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}

// FooterGroup
export class CreateFooterGroupDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}
export class UpdateFooterGroupDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}

// FooterLink
export class CreateFooterLinkDto {
  @ApiProperty() @IsString() groupId: string;
  @ApiProperty() @IsString() label: string;
  @ApiProperty() @IsString() targetView: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}
export class UpdateFooterLinkDto {
  @ApiPropertyOptional() @IsOptional() @IsString() groupId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetView?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}

// FaqCategory
export class CreateFaqCategoryDto {
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsString() displayLabel: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}
export class UpdateFaqCategoryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() displayLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}

// FaqItem
export class CreateFaqItemDto {
  @ApiProperty() @IsString() faqCategoryId: string;
  @ApiProperty() @IsString() question: string;
  @ApiProperty() @IsString() answer: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}
export class UpdateFaqItemDto {
  @ApiPropertyOptional() @IsOptional() @IsString() faqCategoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() question?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() answer?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}

// AboutPillar
export class CreateAboutPillarDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() iconName: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}
export class UpdateAboutPillarDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() iconName?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}

// MediaAsset
export class CreateMediaAssetDto {
  @ApiProperty() @IsUrl() url: string;
  @ApiProperty() @IsString() publicId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() altText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() filename?: string;
}
export class UpdateMediaAssetDto {
  @ApiPropertyOptional() @IsOptional() @IsUrl() url?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() publicId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() altText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() filename?: string;
}

// ContactInquiryOption
export class CreateContactInquiryOptionDto {
  @ApiProperty() @IsString() value: string;
  @ApiProperty() @IsString() label: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}
export class UpdateContactInquiryOptionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() value?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}

// AmazonModalBenefit
export class CreateAmazonModalBenefitDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() iconName?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}
export class UpdateAmazonModalBenefitDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() iconName?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
}
