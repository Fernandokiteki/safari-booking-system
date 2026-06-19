from pydantic import BaseModel
from typing import List

class MonthlyRevenue(BaseModel):
    month:    str
    revenue:  float
    bookings: int

class StatusBreakdown(BaseModel):
    status: str
    count:  int

class TypeBreakdown(BaseModel):
    type:    str
    count:   int
    revenue: float

class TopPackage(BaseModel):
    name:     str
    bookings: int
    revenue:  float

class ReportData(BaseModel):
    monthly_revenue:   List[MonthlyRevenue]
    status_breakdown:  List[StatusBreakdown]
    type_breakdown:    List[TypeBreakdown]
    top_packages:      List[TopPackage]